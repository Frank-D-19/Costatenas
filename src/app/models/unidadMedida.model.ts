import { Parametro } from './parametro.model';

export interface UnidadMedida{
  id?:number,
  nombre:string,
  parametro?: Parametro,
  created_at?: any,
  updated_at?: any
}
