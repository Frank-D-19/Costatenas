import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Indicador } from '../../../models/indicador.model';
import { IndicadoresService } from '../../../services/indicadores.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as jsPDF from 'jspdf';
import $ from '../../../../../node_modules/jquery';
import * as Highcharts from 'highcharts';
import { UnidadesMedidaService } from '../../../services/unidades_medida.service';
import { UnidadMedida } from '../../../models/unidadMedida.model';
import { Parametro } from '../../../models/parametro.model';
import {ParametrosService} from "../../../services/parametros.service";
import {MedicionesListComponent} from "../../geoportal/mediciones/mediciones-list/mediciones-list.component";
import {MedicionesService} from "../../../services/mediciones.service";
import {ZonasService} from "../../../services/zonas.service";
import {Zona} from "../../../models/zona.model";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

declare let ocpu;

@Component({
  selector: 'app-parametro-show',
  templateUrl: './parametro-show.component.html',
  styleUrls: ['./parametro-show.component.scss']
})
export class ParametroShowComponent implements OnInit {

  indicador: Indicador;
  highcharts = Highcharts;
  data = [];
  parametro: Parametro;
  unidad_medida: UnidadMedida;
  zonas:Zona[]=[];
  medComponent:MedicionesListComponent;
  zonasSub:Subscription;
  form:FormGroup;
  parametroId:string;
  notMed:boolean;


  constructor(private parametrosService: ParametrosService,
              private unidadesMedidaService: UnidadesMedidaService,
              private indicadoresService: IndicadoresService,
              private zonasService:ZonasService,
              private medService:MedicionesService,
              private route:ActivatedRoute) {
    this.medComponent=new MedicionesListComponent(this.medService,this.route);
  }

  ngOnInit() {
    this.notMed=false;
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      var parametroId=paramMap.get("parametro_id");
      this.parametroId=parametroId;

      this.parametrosService.getParametro(parametroId).subscribe(parametroData=>{
        this.parametro={
          id: parametroData.parametro.id,
          nombre: parametroData.parametro.nombre,
          unidad_medida: parametroData.parametro.unidad_medida,
          indicador: parametroData.parametro.indicador,
          created_at: parametroData.parametro.created_at,
          updated_at: parametroData.parametro.updated_at
        };

        this.zonasService.getZonas();
        this.zonasSub = this.zonasService.getZonasActualizadasListener()
          .subscribe((zonaData:{zonas: Zona[]})=>{
            zonaData.zonas.forEach(zone => {
              zone.parametros.forEach(parameter => {
                if(parameter.id==parametroId) {
                  this.zonas.push(zone);
                  }
                }
              );
            });
          });

      });

    });

    this.form=new FormGroup({
      zonas: new  FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  generarPDF(){
    var doc = new jsPDF();
    doc.text('Reporte',10,10)
    doc.fromHTML($('#body').get(0),15,15);
    doc.save('tabla.pdf');
  }

  Mostrar()
  {
    if(this.form.invalid)
    {
      return;
    }
    this.medComponent=new MedicionesListComponent(this.medService,this.route);
    this.medComponent.cargarMediciones(this.parametroId,this.form.value.zonas.id);
    this.notMed=true;
  }

  click(){
    var req = ocpu.rpc("hello", { }, function(output){
      console.log(output);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
  }

}
