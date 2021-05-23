import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL_API } from "../../environments/environment";
import { Parametro } from '../models/parametro.model';

const Backend_Parametros_Url=URL_API+"parametros";

@Injectable({providedIn: "root"})
export class ParametrosService{
  parametros: Parametro[]=[];
  parametrosActualizados= new Subject<{parametros:Parametro[]}>();

  constructor(private http: HttpClient) {}

  getParametros(){
    this.http
      .get<{mensaje:string;parametros:any}>(Backend_Parametros_Url)
      .pipe(map(parametroData=>{
        return{
          parametros: parametroData.parametros.map(parametro=>{
            return{
              id:parametro.id,
              nombre: parametro.nombre,
              indicador: parametro.indicador,
              unidad_medida: parametro.unidad_medida,
              zonas: parametro.zonas
            };
          })
        };
      }))
      .subscribe(transformedParametroData=>{
        this.parametros= transformedParametroData.parametros;
        this.parametrosActualizados.next({
          parametros: [...this.parametros]
        });
      });
  }

  getParametrosActualizadosListener(){
    return this.parametrosActualizados.asObservable();
  }

  getParametro(id){
    return this.http.get<{mensaje:string;parametro:Parametro}>(Backend_Parametros_Url+'/'+ id);
  }

  addParametro(parametro:Parametro)
  {
    console.log(parametro);
    return this.http.post<{mensaje:string, parametro:string}>(Backend_Parametros_Url, parametro);
  }

  updateParametro(parametro:Parametro){
    const par:Parametro=parametro;
    this.http.put<{mensaje:string; parametro:Parametro}>(Backend_Parametros_Url+'/'+parametro.id, par)
      .subscribe(response=>{
        const updatedParametros = [...this.parametros];
        const oldParametrosIndex = updatedParametros.findIndex(p=> p.id ===par.id);
        updatedParametros[oldParametrosIndex]= par;
        this.parametros=updatedParametros;
        this.parametrosActualizados.next({
        parametros: [...this.parametros]
      });
    });
  }

  deleteParametro(parametroId){
    return this.http.delete<{mensaje:string}>(Backend_Parametros_Url +'/'+parametroId)
      .subscribe((response)=>{
        console.log(response.mensaje);
        const updatedParametros= this.parametros.filter(parametro=>parametro.id!==parametroId);
        this.parametros=updatedParametros;
        this.parametrosActualizados.next({
          parametros: [...this.parametros]
        });
      });
  }
}
