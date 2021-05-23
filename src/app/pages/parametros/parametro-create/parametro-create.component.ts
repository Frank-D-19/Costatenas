import { Component, OnInit, Inject } from '@angular/core';
import { Indicador } from 'src/app/models/indicador.model';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Parametro } from 'src/app/models/parametro.model';
import { Subscription } from 'rxjs';
import { ParametrosService } from 'src/app/services/parametros.service';
import { ParametroCreateModalComponent } from '../../parametros/parametro-create-modal/parametro-create-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Zona } from 'src/app/models/zona.model';
import { ZonasService } from 'src/app/services/zonas.service';
import {UnidadMedida} from "../../../models/unidadMedida.model";
import {UnidadesMedidaService} from "../../../services/unidades_medida.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-parametro-create',
  templateUrl: './parametro-create.component.html',
  styleUrls: ['./parametro-create.component.scss']
})
export class ParametroCreateComponent implements OnInit {

  form:FormGroup;
  modo='crear';
  parametro:Parametro;
  unidades_medida:UnidadMedida[]=[];
  unidad_medidaSub:Subscription;

  constructor(
    public parametrosService: ParametrosService,
    private unidad_medidaService:UnidadesMedidaService,
    private dialog: MatDialog,
    private router: Router,
    private indicadoresService:IndicadoresService,
    private route:ActivatedRoute,
    private toastrService: ToastrService
  ) { }

  public dialogRef: MatDialogRef<ParametroCreateComponent>

  ngOnInit() {

    this.unidad_medidaService.getUnidadesMedida();
    this.unidad_medidaSub = this.unidad_medidaService.getUnidadesMedidaActualizadasListener()
      .subscribe((unidad_medidaData:{unidades_medida: UnidadMedida[]})=>{
        this.unidades_medida = unidad_medidaData.unidades_medida;
      });

    this.form=new FormGroup({
      nombre: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      unidad_medida: new  FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("parametro_id")){
        this.modo='editar';
        var parametroId=paramMap.get("parametro_id");

        this.parametrosService.getParametro(parametroId).subscribe(parametroData=>{
          this.parametro={
            id: parametroData.parametro.id,
            nombre: parametroData.parametro.nombre,
            unidad_medida: parametroData.parametro.unidad_medida,
            indicador: parametroData.parametro.indicador
            // color: indicadorData.indicador.color
          };
          console.log(this.parametro);

          this.form.setValue({
            nombre: this.parametro.nombre,
            unidad_medida: this.parametro.unidad_medida
            //color:this.indicador.color
          });
        });
      }
    });

  }

  onSaveParametro() {
    if(this.form.invalid)
    {
      this.toastrService.warning("Por favor ingrese correctamente todos los datos del formulario","Aviso!!!");
      return;
    }
    var parametro:Parametro= {
      nombre: this.form.value.nombre,
      unidad_medida: this.form.value.unidad_medida,
      indicador: this.parametro.indicador
    };

    if(this.modo==='crear'){

      this.parametrosService.addParametro(parametro).subscribe((parametroData)=>{
        this.toastrService.success("El parametro ha sido creado correctamente","Exito!"),
        this.router.navigate(['/parametros']);
      });
    }
    else{
      parametro.id=this.parametro.id;
      this.parametrosService.updateParametro(parametro);
      this.toastrService.success("El parametro ha sido actualizado correctamente","Exito!");
      this.router.navigate(["/parametros"]);
    }
  }

  showUnidadMedidaForm() {

  }

}
