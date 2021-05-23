import { Parametro } from './parametro.model';

export interface Zona{
  id?: number,
  nombre?: string,
  geom,
  parametros?:any
}
