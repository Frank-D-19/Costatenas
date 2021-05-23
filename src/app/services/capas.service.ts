import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
import { Capa } from '../models/capa.model';

const Backend_Capa_Url=URL_API+"capas";

@Injectable({providedIn: "root"})
export class CapaService {

  /*workspaces:Workspace[]=[];
  workspacesActualizados= new Subject<{workspaces:Workspace[]}>();*/

  constructor(private http: HttpClient, private router: Router) {}

  /*getWorkspaces(){
    this.http
      .get<{mensaje:string;workspace:any}>(Backend_Workspaces_Url)
      .pipe(map(workspacesData=>{
        return{workspaces: workspacesData.workspace.map(workspace=>{
            return{
              nombre: workspace.name,
            };
          })
        };
      }))
      .subscribe(transformedWorksapceData=>{
        this.workspaces= transformedWorksapceData.workspaces;
        this.workspacesActualizados.next({
          workspaces: [...this.workspaces]
        });
      });
  }

  getWorkspacesActualizadosListener(){
    return this.workspacesActualizados.asObservable();
  }*/

  addCapa( capa: File)
  {
    const capaData= new FormData();
    capaData.append('file', capa ,'pepe');
    console.log(capaData);
    return this.http.post<{mensaje:string, out:any}>(Backend_Capa_Url , capaData);
  }


}
