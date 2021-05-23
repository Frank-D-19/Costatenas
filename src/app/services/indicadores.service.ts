import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
import { Indicador } from '../models/indicador.model';

const Backend_Indicadores_Url=URL_API+"indicadores";

@Injectable({providedIn: "root"})
export class IndicadoresService{
  indicadores:Indicador[]=[];
  indicadoresActualizados= new Subject<{indicadores:Indicador[]}>();

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  getIndicadores(){
    this.http
      .get<{mensaje:string;indicadores:any}>(Backend_Indicadores_Url)
      .pipe(map(indicadorData=>{
        return{
          indicadores: indicadorData.indicadores.map(indicador=>{
            return{
              id:indicador.id,
              nombre: indicador.nombre,
              definicion: indicador.definicion,
              importancia: indicador.importancia,
              fuente: indicador.fuente,
              colaboracion: indicador.colaboracion,
              parametros: indicador.parametros,
              created_at: indicador.created_at,
              updated_at: indicador.updated_at,
              color: indicador.color
            };
          })
        };
      }))
      .subscribe(transformedIndicadorData=>{
        this.indicadores= transformedIndicadorData.indicadores;
        this.indicadoresActualizados.next({
          indicadores: [...this.indicadores]
        });
      });
  }

  getIndicadoresActualizadosListener(){
    return this.indicadoresActualizados.asObservable();
  }

  getIndicador(id){
    return this.http.get<{mensaje:string;indicador:Indicador}>(Backend_Indicadores_Url+'/'+ id);
  }

  addIndicador(indicador:Indicador)
  {
   return this.http.post<{mensaje:string, indicador:Indicador}>(Backend_Indicadores_Url , indicador);
  }

  updateIndicador(indicador:Indicador){
    const ind:Indicador=indicador;

    this.http.put<{mensaje:string; indicador:Indicador}>(Backend_Indicadores_Url+'/'+indicador.id, ind)
      .subscribe(response=>{
      const updatedIndicadores = [...this.indicadores];
      const oldIndicadoresIndex = updatedIndicadores.findIndex(p=> p.id ===ind.id);
      updatedIndicadores[oldIndicadoresIndex]= ind;
      this.indicadores=updatedIndicadores;
      this.indicadoresActualizados.next({
        indicadores: [...this.indicadores]
      });
    });
  }

  deleteIndicador(indicadorId){
    return this.http.delete<{mensaje:string}>(Backend_Indicadores_Url +'/'+indicadorId)
    .subscribe(()=>{
      const updatedIndicadores= this.indicadores.filter(indicador=>indicador.id!==indicadorId);
      this.indicadores=updatedIndicadores;
      this.indicadoresActualizados.next({
        indicadores: [...this.indicadores]
      });
    });
  }

}
