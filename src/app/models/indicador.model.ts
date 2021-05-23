import { Parametro } from './parametro.model';

export interface Indicador{
  id?: number,
  nombre: string,
  definicion: string,
  importancia: string,
  fuente: string,
  colaboracion: string,
  color: string,
  valoracion: string,
  procedimiento: string,
  parametros?: Parametro[],
  created_at?,
  updated_at?
}
