import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validator, Validators, FormControl, Form} from '@angular/forms';
import { Workspace } from '../../../models/workspace.model';
import { ToastrService } from 'ngx-toastr';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Router } from '@angular/router';
import {UnidadMedida} from "../../../models/unidadMedida.model";
import {Subscription} from "rxjs";
import {Capa} from "../../../models/capa.model";
import {CapaService} from "../../../services/capas.service";
import {FileResolver} from "codelyzer/angular/fileResolver/fileResolver";

@Component({
  selector: 'app-capa-create',
  templateUrl: './capa-create.component.html',
  styleUrls: ['./capa-create.component.scss']
})
export class CapaCreateComponent implements OnInit {

form:FormGroup;
workspaces:Workspace[]=[];
workspaceSub: Subscription;
selected: boolean=false;
selected2: boolean=false;
filePreview: string;

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private capaService: CapaService,
    private toastrService:ToastrService) { }

  ngOnInit() {
    this.workspaceService.getWorkspaces();
    this.workspaceSub = this.workspaceService.getWorkspacesActualizadosListener()
      .subscribe((workspaceData:{workspaces: Workspace[]})=>{
        this.workspaces = workspaceData.workspaces;
      });



    this.form=new FormGroup({
      workspace: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      file: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }
  onSelectWorkspace(){
      this.selected=true;
  }

  onSaveCapa(){
    if (this.form.invalid) {
      return;
    }

    var capa = this.form.value.file;

    console.log(capa);
    this.capaService.addCapa(capa) .subscribe(capaData => {
      console.log(capaData);
      this.toastrService.success("La capa ha sido creada correctamente","Exito!");
    });
  }

  onFilePicker(event:Event){
    const file1= (event.target as HTMLInputElement).files[0];
    this.form.patchValue({file: file1});
    this.form.get('file').updateValueAndValidity();
  }
}
