import { EnvType } from '@constants';

export interface AppDbConfig {
  readonly user: string;
  readonly password: string;
  readonly port: number;
  readonly database: string;
  readonly host?: string;
  sync?: boolean;
}

export interface Env {
  readonly env: EnvType;
  readonly port: number;
  readonly db: AppDbConfig;
}
