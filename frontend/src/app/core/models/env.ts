import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';

export const Env = new InjectionToken<Env>('ENV_PROVIDER', {
  factory: () => environment
})

export interface Env {
  apiUrl: string;
  production: boolean;
}
