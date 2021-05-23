import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Indicador } from 'src/app/models/indicador.model';
import { Parametro } from 'src/app/models/parametro.model';
import { ParametroCreateModalComponent } from '../../parametros/parametro-create-modal/parametro-create-modal.component';
import { UnidadMedida } from 'src/app/models/unidadMedida.model';
import { ParametrosService } from 'src/app/services/parametros.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-indicador-create-modal',
  templateUrl: './indicador-create-modal.component.html',
  styleUrls: ['./indicador-create-modal.component.scss']
})
export class IndicadorCreateModalComponent implements OnInit {
  form:FormGroup;
  isSubmited:boolean=false;
  parametros:Parametro[]=[];

  parametrosSub:Subscription;

  constructor(public parametrosService: ParametrosService,
              private toastrService:ToastrService,
              private dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              private indicadoresService:IndicadoresService,
              public dialogRef: MatDialogRef<IndicadorCreateModalComponent>) {
      iconRegistry.addSvgIcon(
        'close',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/close.svg')
      );
  }

  ngOnInit() {
    this.parametrosService.getParametros();
    this.parametrosSub = this.parametrosService.getParametrosActualizadosListener()
      .subscribe((parametroData:{parametros: Parametro[]})=>{
        parametroData.parametros.forEach(parametro => {
          if(!parametro.indicador)
            this.parametros.push(parametro);
        });
    });

    this.form=new FormGroup({
      nombre: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      definicion: new  FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      importancia: new  FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      fuente: new  FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      colaboracion: new  FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      parametros: new  FormControl(null, {
        validators: [Validators.required]
      }),
      color: new  FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }

  showParametroForm(){
    const dRef= this.dialog.open(ParametroCreateModalComponent, { width: '50%' });
    dRef.afterClosed().subscribe(result=>{
      if(result){
        this.parametros.push(result);
      }
    });
  }

  onSaveIndicador(){
    this.isSubmited=true;
    if(this.form.invalid){
      this.toastrService.warning("Por favor ingrese correctamente todos los datos del formulario","Aviso!!!");
      return;
    }
    var indicador:Indicador= {
      nombre: this.form.value.nombre,
      definicion: this.form.value.definicion,
      importancia: this.form.value.importancia,
      fuente: this.form.value.fuente,
      colaboracion: this.form.value.colaboracion,
      parametros: this.form.value.parametros,
      color: this.form.value.color,
      valoracion: this.form.value.valoracion,
      procedimiento: this.form.value.procedimiento
    };

    this.indicadoresService.addIndicador(indicador).subscribe((indicadorData)=>{
      indicadorData.indicador.parametros=indicador.parametros;
      indicadorData.indicador.parametros.forEach(parametro => {
        parametro.indicador={
          id: indicadorData.indicador.id,
          nombre: indicadorData.indicador.nombre,
          definicion: indicadorData.indicador.definicion,
          importancia: indicadorData.indicador.importancia,
          colaboracion: indicadorData.indicador.colaboracion,
          fuente: indicadorData.indicador.fuente,
          color: indicadorData.indicador.color,
          valoracion: indicadorData.indicador.valoracion,
          procedimiento: indicadorData.indicador.procedimiento
        };
        this.parametrosService.updateParametro(parametro);
      });
      this.dialogRef.close(indicadorData.indicador);
    });
  }
}
