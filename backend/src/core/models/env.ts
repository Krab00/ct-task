import { EnvType } from '@constants';


export interface Env {
  readonly env: EnvType;
  readonly port: number;
}
