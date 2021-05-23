import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatIconRegistry } from '@angular/material';
import { Parametro } from '../../../models/parametro.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UnidadMedida } from '../../../models/unidadMedida.model';
import { UnidadesMedidaService } from '../../../services/unidades_medida.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ParametrosService } from '../../../services/parametros.service';
import { ToastrService } from 'ngx-toastr';
import {Zona} from "../../../models/zona.model";
import {ZonasService} from "../../../services/zonas.service";

@Component({
  selector: 'app-parametro-create-modal',
  templateUrl: './parametro-create-modal.component.html',
  styleUrls: ['./parametro-create-modal.component.scss']
})
export class ParametroCreateModalComponent implements OnInit {

  form:FormGroup;
  isSubmited:boolean=false;
  unidades_medida:UnidadMedida[]=[];
  unidades_medidaSub:Subscription;
  zonas:Zona[]=[];
  zonasSub:Subscription;

  constructor(public parametrosService:ParametrosService,
              private toastrService:ToastrService,
              private unidades_medidaService:UnidadesMedidaService,
              private zonasService: ZonasService,
              public dialogRef: MatDialogRef<ParametroCreateModalComponent>,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
                  iconRegistry.addSvgIcon(
        'close',
                  sanitizer.bypassSecurityTrustResourceUrl('assets/images/close.svg')
      );
    }

  ngOnInit() {
    this.unidades_medidaService.getUnidadesMedida();
    this.unidades_medidaSub= this.unidades_medidaService.getUnidadesMedidaActualizadasListener()
    .subscribe((unidad_medidaData:{unidades_medida: UnidadMedida[]})=>{
      this.unidades_medida = unidad_medidaData.unidades_medida;
    });

  this.zonasService.getZonas();
  this.zonasSub = this.zonasService.getZonasActualizadasListener()
    .subscribe((zonaData:{zonas: Zona[]})=>{
      zonaData.zonas.forEach(parametro => {
        this.zonas=zonaData.zonas;
      });
    });

    this.form=new FormGroup({
      nombre: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      unidad_medida: new  FormControl(null, {
        validators: [Validators.required]
      }),
      zonas: new  FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  crearNuevaZona(){

  }

  closeDialog(){
    this.dialogRef.close();
  }

  onSaveParametro(){
    this.isSubmited=true;
    if(this.form.invalid){
      this.toastrService.warning("Por favor ingrese correctamente todos los datos del formulario","Aviso!!!");
      return;
    }

    var zonasId=[];
    var zones = this.form.value.zonas;
    zones.forEach(z => {
      zonasId.push(z.id);
    })

    var parametro:Parametro= {
      nombre: this.form.value.nombre,
      unidad_medida: this.form.value.unidad_medida.id,
      zonas: zonasId
    };

    this.parametrosService.addParametro(parametro).subscribe((parametroData)=>{
      this.toastrService.success("El parametro ha sido creado correctamente","Exito!"),
      this.dialogRef.close(parametroData.parametro);
    });
  }
}
