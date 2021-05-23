import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
import { CapaBase } from "../models/capaBase.model";
import { ToastrService } from 'ngx-toastr';

const Backend_CapasBases_Url=URL_API+"capasBase";

@Injectable({providedIn: "root"})
export class CapasBasesService{
    capasBases:CapaBase[]=[];
    capasBasesActualizadas= new Subject<{capasBases:CapaBase[]}>();
  
    constructor(private http: HttpClient,  private toastr:ToastrService, private router: Router) {}

    getCapasBases(){
        this.http
            .get<{mensaje:string;capasBases:any}>(Backend_CapasBases_Url)
            .pipe(map(capasBasesData=>{
            return{
                capasBases: capasBasesData.capasBases.map(capasBase=>{
                return{
                    id:capasBase.id,
                    nombre: capasBase.nombre,
                    url: capasBase.url,
                    capa: capasBase.capa,
                    attribution: capasBase.attribution,
                    created_at: capasBase.created_at,
                    updated_at: capasBase.updated_at
                };
                })
            };
            }))
            .subscribe(transformedcapasBaseData=>{
            this.capasBases= transformedcapasBaseData.capasBases;
            this.capasBasesActualizadas.next({
                capasBases: [...this.capasBases]
            });
        });
    }
    
    getCapasBasesActualizadasListener(){
    return this.capasBasesActualizadas.asObservable();
    }

    getCapaBase(id){
        return this.http.get<{mensaje:string;capaBase:CapaBase}>(Backend_CapasBases_Url+'/'+ id);
    }
    
    addCapaBase(capaBase:CapaBase){
        return this.http.post<{mensaje:string, capaBase:CapaBase}>(Backend_CapasBases_Url , capaBase).subscribe(response=>{
            this.toastr.success(response.mensaje,'Operación exitosa');
        }), error=>{
            this.toastr.success(error,'Operación exitosa')
        };
    }

    updateCapaBase(capaBase:CapaBase){
        const cb:CapaBase=capaBase;
    
        this.http.put<{mensaje:string; capaBase:CapaBase}>(Backend_CapasBases_Url+'/'+capaBase.id, cb).subscribe(response=>{
            const updatedCapasBases = [...this.capasBases];
            const oldCapasBasesIndex = updatedCapasBases.findIndex(p=> p.id ===cb.id);
            updatedCapasBases[oldCapasBasesIndex]= cb;
            this.capasBases=updatedCapasBases;
            this.capasBasesActualizadas.next({
              capasBases: [...this.capasBases]
            });

            this.toastr.success(response.mensaje,'Operación exitosa');
        });
      }

      deleteCapaBase(capaBaseId){
        return this.http.delete<{mensaje:string}>(Backend_CapasBases_Url +'/'+capaBaseId)
        .subscribe((response)=>{
          const updatedCapasBases= this.capasBases.filter(capaBase=>capaBase.id!==capaBaseId);
          this.capasBases=updatedCapasBases;
          this.capasBasesActualizadas.next({
            capasBases: [...this.capasBases]
          });
          this.toastr.success(response.mensaje,'Operación exitosa');

        });
      }
}