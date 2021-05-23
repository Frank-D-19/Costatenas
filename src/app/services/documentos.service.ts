import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
import { TipoDocumento } from '../models/tipodocumento.model';
import { Documento } from '../models/documento.model';

const Backend_Documento_Url=URL_API+"documentos";

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  documento:Documento[]=[];
  documentoObs= new Subject<{documento:Documento[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getDocumento(){
    this.http.get<{mensaje:string;documento:any}>(Backend_Documento_Url)
    .pipe(map(documentosData=>{
      console.log(documentosData);
     return{
      documento: documentosData.documento.map(documento=>{
        console.log(documento);
          return{
            id:documento.id,
            denominacion: documento.denominacion,
            idtipo: documento.idtipo,
            url: documento.url,
            created_at: documento.created_at,
            updated_at: documento.created_at
          };
        })
      };
    }))
    .subscribe(transformedDocumentoData=>{
      this.documento = transformedDocumentoData.documento;
      this.documentoObs.next({
        documento: [...this.documento]
      });
    });
  }
  getDocumentoListener(){
    return this.documentoObs.asObservable();
  }
}
