import { Mapa } from '../clases/mapa/mapa';

export interface CapaBase{
  id?: number,
  nombre: string,
  url: string,
  capa: string,
  attribution: string,
  mapa?:Mapa,
  created_at?,
  updated_at?
}
