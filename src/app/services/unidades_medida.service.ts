import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
import { Indicador } from '../models/indicador.model';
import { UnidadMedida } from '../models/unidadMedida.model';
import {Parametro} from "../models/parametro.model";

const Backend_UnidadesMedida_Url=URL_API+"unidades_medida";

@Injectable({providedIn: "root"})
export class UnidadesMedidaService{
  unidades_medida:UnidadMedida[]=[];
  unidades_medidaActualizadas= new Subject<{unidades_medida:UnidadMedida[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getUnidadesMedida(){
    this.http
      .get<{mensaje:string;unidades_medida:any}>(Backend_UnidadesMedida_Url)
      .pipe(map(unidades_medidaData=>{
        return{
          indicadores: unidades_medidaData.unidades_medida.map(unidad_medida=>{
            return{
              id:unidad_medida.id,
              nombre: unidad_medida.nombre,
              created_at: unidad_medida.created_at,
              updated_at: unidad_medida.created_at
            };
          })
        };
      }))
      .subscribe(transformedunidadMedidaData=>{
        this.unidades_medida= transformedunidadMedidaData.indicadores;
        this.unidades_medidaActualizadas.next({
          unidades_medida: [...this.unidades_medida]
        });
      });
  }

  getUnidadesMedidaActualizadasListener(){
    return this.unidades_medidaActualizadas.asObservable();
  }

  getUnidadMedida(id){
    return this.http.get<{mensaje:string;unidad_medida:UnidadMedida}>(Backend_UnidadesMedida_Url+'/'+ id);
  }
}
