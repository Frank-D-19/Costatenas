import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ParametroCreateModalComponent } from '../../parametros/parametro-create-modal/parametro-create-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import {ToastrService} from "ngx-toastr";
import {Zona} from "../../../models/zona.model";
import {ZonasService} from "../../../services/zonas.service";
import {Indicador} from "../../../models/indicador.model";
import {IndicadoresService} from "../../../services/indicadores.service";
import {Parametro} from "../../../models/parametro.model";
import {ParametrosService} from "../../../services/parametros.service";
import {UnidadesMedidaService} from "../../../services/unidades_medida.service";
import {UnidadMedida} from "../../../models/unidadMedida.model";

@Component({
  selector: 'app-indicador-create',
  templateUrl: './indicador-create.component.html',
  styleUrls: ['./indicador-create.component.scss']
})
export class IndicadorCreateComponent implements OnInit {
  form:FormGroup;
  modo='crear';
  indicador:Indicador;
  parametros:Parametro[]=[];
  //zonas:Zona[]=[];
  parametrosSub:Subscription;
  //zonasSub:Subscription;
  unidad:UnidadMedida;
  isSubmited:boolean=false;

  constructor(
    public zonasService:ZonasService,
    public parametrosService: ParametrosService,
    public unidadMedidaService: UnidadesMedidaService,
    private dialog: MatDialog,
    private router: Router,
    private indicadoresService:IndicadoresService,
    private route:ActivatedRoute,
    private toastrService:ToastrService) { }

  public dialogRef: MatDialogRef<IndicadorCreateComponent>
  ngOnInit() {
    this.parametrosService.getParametros();
    this.parametrosSub = this.parametrosService.getParametrosActualizadosListener()
      .subscribe((parametroData:{parametros: Parametro[]})=>{
        parametroData.parametros.forEach(parametro => {
          if(!parametro.indicador)
            this.parametros.push(parametro);
        });
    });


    /*this.zonasService.getZonas();
    this.zonasSub = this.zonasService.getZonasActualizadasListener()
      .subscribe((zonaData:{zonas: Zona[]})=>{
        zonaData.zonas.forEach(parametro => {
            this.zonas=zonaData.zonas;
        });
    });*/

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
      valoracion: new  FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      procedimiento: new  FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      parametros: new  FormControl(null, {
        validators: [Validators.required]
      }),
      color: new  FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("indicador_id")){
        this.modo='editar';
        var indicadorId=paramMap.get("indicador_id");

        this.indicadoresService.getIndicador(indicadorId).subscribe(indicadorData=>{
          console.log(indicadorData);
          this.indicador={
            id: indicadorData.indicador.id,
            nombre: indicadorData.indicador.nombre,
            definicion: indicadorData.indicador.definicion,
            importancia: indicadorData.indicador.importancia,
            fuente: indicadorData.indicador.fuente,
            colaboracion: indicadorData.indicador.colaboracion,
            parametros: indicadorData.indicador.parametros,
            created_at: indicadorData.indicador.created_at,
            updated_at:indicadorData.indicador.updated_at,
            color: indicadorData.indicador.color,
            valoracion: indicadorData.indicador.valoracion,
            procedimiento: indicadorData.indicador.procedimiento
          };
          this.form.setValue({
            nombre: this.indicador.nombre,
            definicion: this.indicador.definicion,
            importancia: this.indicador.importancia,
            fuente: this.indicador.fuente,
            colaboracion: this.indicador.colaboracion,
            parametros: this.indicador.parametros,
            color: this.indicador.color,
            valoracion: this.indicador.valoracion,
            procedimiento: this.indicador.procedimiento
          });
          this.indicador.parametros.forEach(parametro => {
              this.parametros.push(parametro);
          });
        });
      }
    });
  }
  showParametroForm(){
    const dRef= this.dialog.open(ParametroCreateModalComponent, { width: '50%' });
    dRef.afterClosed().subscribe(result=>{
      if(result){
        this.unidadMedidaService.getUnidadMedida(result.unidad_medida_id).subscribe(unidadMedidaData=>{
          this.unidad={
          id: unidadMedidaData.unidad_medida.id,
          nombre: unidadMedidaData.unidad_medida.nombre,
          };

          var newParametro :Parametro ={
            id: result.id,
            nombre: result.nombre,
            unidad_medida: this.unidad
          }
          this.parametros.push(newParametro);
        });
      }
    });
  }

  onSaveIndicador(){
    this.isSubmited=true;
    if(this.form.invalid)
    {
      this.toastrService.warning("Por favor ingrese correctamente todos los datos del formulario","Aviso!!!");
      return;
    }

    console.log(this.form.value.color);
    var indicador:Indicador= {
      nombre: this.form.value.nombre,
      definicion: this.form.value.definicion,
      importancia: this.form.value.importancia,
      fuente: this.form.value.fuente,
      colaboracion: this.form.value.colaboracion,
      color: this.form.value.color,
      valoracion: this.form.value.valoracion,
      procedimiento: this.form.value.procedimiento,
      parametros:this.form.value.parametros,
      //zonas:this.form.value.zonas
    };

    if(this.modo==='crear'){

      this.indicadoresService.addIndicador(indicador).subscribe(indicadorData=>{
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
        this.router.navigate(['/indicadores']);
       });
      this.toastrService.success("El indicador ha sido creado correctamente","Exito!");

    }
    else if(this.modo==='zona'){

           this.router.navigate(['/geoportal/zonas/crear']);
      }
    else{
      indicador.id=this.indicador.id;
      this.indicadoresService.updateIndicador(indicador);
      indicador.parametros.forEach(parametro => {
        parametro.indicador={
          id: indicador.id,
          nombre: indicador.nombre,
          definicion: indicador.definicion,
          importancia: indicador.importancia,
          colaboracion: indicador.colaboracion,
          fuente: indicador.fuente,
          color: indicador.color,
          valoracion: indicador.valoracion,
          procedimiento: indicador.procedimiento
        };
        this.parametrosService.updateParametro(parametro);
      });

      this.toastrService.success("El indicador ha sido actualizado correctamente","Exito!");
      this.router.navigate(["/indicadores"]);
    }
  }
}

