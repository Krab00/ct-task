import { Router } from 'express';


export type ControllerModule = {
  default?: unknown;
  router?: Router;
  routes?: Router;
  [key: string]: unknown;
}

export type AutoRouteOptions = {
  controllersPath: string;
  routePrefix: string;
  recursive: boolean;
  verbose: boolean;
}
