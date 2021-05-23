import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
import { Workspace } from '../models/workspace.model';

const Backend_Workspaces_Url=URL_API+"workspace";

@Injectable({providedIn: "root"})
export class WorkspaceService {

  workspaces:Workspace[]=[];
  workspacesActualizados= new Subject<{workspaces:Workspace[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getWorkspaces(){
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
  }

  addWorkspace(workspace: Workspace)
  {
    return this.http.post<{mensaje:string, workspace:Workspace}>(Backend_Workspaces_Url , workspace);
  }


}
