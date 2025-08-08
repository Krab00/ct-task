import { Express, Router } from 'express';
import { glob } from 'glob';
import path from 'path';
import { AutoRouteOptions, ControllerModule } from '../models';

const defaultOptions: AutoRouteOptions = {
  controllersPath: process.env.NODE_ENV === 'production' ? 'dist/features' : 'src/features',
  routePrefix: '',
  recursive: true,
  verbose: true,
};

export const autoRegisterRoutes = (options: Partial<AutoRouteOptions> = {}) => {
  const config = { ...defaultOptions, ...options };

  return async (app: Express): Promise<void> => {
    try {
      const extension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
      const pattern = config.recursive
        ? `${config.controllersPath}/**/*.controller.${extension}`
        : `${config.controllersPath}/*.controller.${extension}`;

      const controllerFiles = await glob(pattern, {
        cwd: process.cwd(),
        absolute: true,
      });

      if (config.verbose) {
        controllerFiles.forEach(file => console.log(`  - ${file}`));
      }

      for (const filePath of controllerFiles) {
        await registerController(app, filePath, config);
      }

      if (config.verbose) {
        console.log('Route registration completed');
      }
    } catch (error) {
      console.error('Route registration error:', error);
      throw error;
    }
  };
};

async function registerController(
  app: Express,
  filePath: string,
  config: AutoRouteOptions
): Promise<void> {
  try {
    const module: ControllerModule = await import(filePath);

    const router = extractRouter(module);
    if (!router) {
      return;
    }

    const routePath = generateRoutePath(filePath, config);
    app.use(`${routePath}`, router);

    if (config.verbose) {
      console.log(
        `Registered routes from ${path.basename(filePath)} at ${routePath}`
      );
    }
  } catch (error) {
    console.error(`Failed to register controller ${filePath}:`, error);
    throw error;
  }
}

function extractRouter(module: ControllerModule): Router | null {
  if (typeof module?.router === 'function' && 'stack' in module.router) {
    return module.router as Router;
  }

  if (typeof module.routes === 'function' && 'stack' in module.routes) {
    return module.routes as Router;
  }

  if (typeof module.default === 'function' && 'stack' in module.default) {
    return module.default as Router;
  }

  return null;
}

function generateRoutePath(filePath: string, config: AutoRouteOptions): string {
  const extension = process.env.NODE_ENV === 'production' ? '.controller.js' : '.controller.ts';
  const fileName = path.basename(filePath, extension);

  let routePath = `/${fileName}`;

  if (config.routePrefix) {
    routePath = `/${config.routePrefix}${routePath}`;
  }

  return routePath.replace(/\/+/g, '/');
}
