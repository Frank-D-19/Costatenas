import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
import { Medicion } from '../models/medicion.model';
import { ToastrService } from 'ngx-toastr';

const Backend_Mediciones_Url=URL_API+"mediciones";

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {
  mediciones: Medicion[]=[];
  medicionesActualizadas= new Subject<{mediciones: Medicion[]}>();

  constructor(private http: HttpClient,  private router: Router, private toastr:ToastrService) {}

  getMedicionesActualizadasListener(){
    return this.medicionesActualizadas.asObservable();
  }

  getMedicionesXzonaXparametro(parametroId, zonaId){
    this.http
      .get<{mensaje:string;mediciones: any}>(Backend_Mediciones_Url+'/zona/'+zonaId+'/parametro/'+parametroId)
      .pipe(map(medicionData=>{
        return{
          mediciones: medicionData.mediciones.map(medicion=>{
            return{
              id:medicion.id,
              valor: Number.parseInt(medicion.valor),
              fecha: medicion.fecha,
              parametro:  medicion.parametro,
              zona: medicion.zona
            };
          })
        };
      }))
      .subscribe(transformedMedicionData=>{
        this.mediciones= transformedMedicionData.mediciones;
        this.medicionesActualizadas.next({
          mediciones: [...this.mediciones]
        });
      });
  }

  getMedicion(id){
    return this.http.get<{mensaje:string;medicion:Medicion}>(Backend_Mediciones_Url+'/'+ id);
  }

  addMedicion(medicion: Medicion){
    this.http.post<{mensaje:string, medicion:Medicion}>(Backend_Mediciones_Url, medicion)
      .subscribe(responseData=>{
        this.toastr.success(responseData.mensaje,"Operación exitosa");
        return responseData.medicion;
    });  
  }

  updateMedicion(medicion:Medicion){
    const med:Medicion=medicion;

    this.http.put<{mensaje:string; medicion:Medicion}>(Backend_Mediciones_Url+'/'+medicion.id, med).subscribe((responseData)=>{
        const updatedMediciones = [...this.mediciones];
        const oldMedicionesIndex = updatedMediciones.findIndex(m=> m.id ===responseData.medicion.id);
        updatedMediciones[oldMedicionesIndex]= responseData.medicion;
        this.mediciones=updatedMediciones;
        this.medicionesActualizadas.next({
          mediciones: [...this.mediciones]
        });
        this.toastr.success(responseData.mensaje,'Operación exitosa');
        this.router.navigate(["/geoportal/mediciones/zona/"+responseData.medicion.zona+"/parametro/"+responseData.medicion.parametro]);
      
    });
  }
}
