import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
import { TipoDocumento } from '../models/tipodocumento.model';


const Backend_TipoDocumento_Url=URL_API+"tipoDocumento";

@Injectable({providedIn: 'root'})

export class TipoDocumentoService {
  
  tipo_documento:TipoDocumento[]=[];
  tipo_documentoObs= new Subject<{tipo_documento:TipoDocumento[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getTipoDocumento(){
    this.http.get<{mensaje:string;tipo_documento:any}>(Backend_TipoDocumento_Url)
    .pipe(map(tipo_documentosData=>{
     return{
      tipoDocumento: tipo_documentosData.tipo_documento.map(tipo_documento=>{
          return{
            id:tipo_documento.id,
            denominacion: tipo_documento.denominacion,
            created_at: tipo_documento.created_at,
            updated_at: tipo_documento.created_at
          };
        })
      };
    }))
    .subscribe(transformedTipoDocumentoData=>{
      this.tipo_documento = transformedTipoDocumentoData.tipoDocumento;
      this.tipo_documentoObs.next({
        tipo_documento: [...this.tipo_documento]
      });
    });
  }
  getTipoDocumentoListener(){
    return this.tipo_documentoObs.asObservable();
  }
}
