import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { URL_API } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';
import { Zona } from '../models/zona.model';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
const Backend_Zonas_Url=URL_API+"zonas";

@Injectable( { providedIn: 'root' } )
export class ZonasService {
  private zonas: Zona[] = [];
  private zonasActualizadas = new Subject<{zonas: Zona[]}>();

  constructor(private toastr:ToastrService, private http:HttpClient) { }

  getZonas(){ 
    this.http
      .get<{mensaje:string;zonas:any}>(Backend_Zonas_Url)
      .pipe(map(zonaData=>{
        return{
          zonas: zonaData.zonas.map(zona=>{
            return{
              id:zona.id,
              nombre:zona.nombre,
              geom: zona.geom,
              parametros: zona.parametros,
            };
          })
        };
      }))
      .subscribe(transformedZonaData=>{
        this.zonas=transformedZonaData.zonas;
        this.zonasActualizadas.next({
          zonas: [...this.zonas]
        });
      });
  }

  getZonasActualizadasListener(){
    return this.zonasActualizadas.asObservable();
  }

  getZona(id){
    return this.http.get<{mensaje:string;zona:Zona}>(Backend_Zonas_Url+'/'+ id);
  }

  addZona(zona:Zona, form:FormGroup)
  {
    this.http.post<{mensaje:string,zona:any}>(Backend_Zonas_Url, zona)
      .subscribe(responseData=>{
        
        form.reset();
        this.toastr.success(responseData.mensaje,"Operación exitosa");
    });
  }

  updateZona(zona:Zona, form:FormGroup){
    const z:Zona=zona;

    this.http.put<{mensaje:string; zona:Zona}>(Backend_Zonas_Url+'/'+zona.id, z).subscribe((responseData)=>{
        const updatedZonas = [...this.zonas];
        const oldZonasIndex = updatedZonas.findIndex(Z=> Z.id ===responseData.zona.id);
        updatedZonas[oldZonasIndex]= responseData.zona;
        this.zonas=updatedZonas;
        this.zonasActualizadas.next({
          zonas: [...this.zonas]
        });
        
        form.reset();
        this.toastr.success(responseData.mensaje,'Operación exitosa');
      
    });
  }

  deleteZona(zonaId, mapa){
    return this.http.delete<{mensaje:string;pz:any}>(Backend_Zonas_Url +'/'+zonaId)
    .subscribe((responseData)=>{
      mapa.removeLayer(zonaId);
      // layer.remove();
      // GeoportalComponent.isInfo=false;
      // GeoportalComponent.info={};
      const updatedZonas= this.zonas.filter(indicador=>indicador.id!==zonaId);
      this.zonas=updatedZonas;
      this.zonasActualizadas.next({
        zonas: [...this.zonas]
      });
      this.toastr.success(responseData.mensaje,'Operación exitosa');
    });
  }
}
