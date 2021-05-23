
import { Indicador } from './indicador.model';
import { UnidadMedida } from './unidadMedida.model';
import { Zona } from './zona.model';

export interface Parametro{
  id?:number,
  nombre:string,
  unidad_medida?: UnidadMedida,
  indicador?: Indicador,
  zonas?: Zona[],
  ultimaMedicion?,
  is_active?,
  created_at?,
  updated_at?
}
