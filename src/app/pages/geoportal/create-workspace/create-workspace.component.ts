import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validator, Validators, FormControl} from '@angular/forms';
import { Workspace } from '../../../models/workspace.model';
import { ToastrService } from 'ngx-toastr';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss']
})
export class CreateWorkspaceComponent implements OnInit {

  form: FormGroup;
  workspace: Workspace;
  constructor(private router: Router, private workspaceService: WorkspaceService, private toastrService:ToastrService) { }


  ngOnInit() {
    this.form = new FormGroup({
      nombre: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
    });
  }
  onSaveWorkspace() {
    if (this.form.invalid) {
      return;
    }
    var workspace: Workspace = {
      nombre: this.form.value.nombre
    };

    this.workspaceService.addWorkspace(workspace) .subscribe(workspaceData => {
      this.toastrService.success("El espacio de trabajo ha sido creado correctamente","Exito!");
    });
  }

}
