import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Indicador } from 'src/app/models/indicador.model';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as jsPDF from 'jspdf';
import $ from '../../../../../node_modules/jquery';
import * as Highcharts from 'highcharts';
import { MedicionesService } from 'src/app/services/mediciones.service';
import { Medicion } from 'src/app/models/medicion.model';
import { Parametro } from 'src/app/models/parametro.model';
import {Subscription} from "rxjs";
declare let ocpu;

@Component({
  selector: 'app-indicador-show',
  templateUrl: './indicador-show.component.html',
  styleUrls: ['./indicador-show.component.scss']
})
export class IndicadorShowComponent implements OnInit{

  indicador: Indicador;
  highcharts = Highcharts;
  data = [];
  parametro: Parametro;
  mediciones: Medicion[]=[];
  sub: Subscription;

  chartOptions = {}

  constructor(private medicionesService: MedicionesService,private indicadoresService: IndicadoresService, private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      var indicadorId=paramMap.get("indicador_id");

      this.indicadoresService.getIndicador(indicadorId).subscribe(indicadorData=>{
        this.indicador={
          id: indicadorData.indicador.id,
          nombre: indicadorData.indicador.nombre,
          definicion: indicadorData.indicador.definicion,
          importancia: indicadorData.indicador.importancia,
          fuente: indicadorData.indicador.fuente,
          colaboracion: indicadorData.indicador.colaboracion,
          color:indicadorData.indicador.color,
          valoracion:indicadorData.indicador.valoracion,
          procedimiento:indicadorData.indicador.procedimiento,
          parametros: indicadorData.indicador.parametros,
          created_at: indicadorData.indicador.created_at,
          updated_at: indicadorData.indicador.updated_at
        };
      });
    });
  }
  generarPDF(){
    var doc = new jsPDF();
    doc.text('Reporte',10,10)
    doc.fromHTML($('#body').get(0),15,15);
    doc.save('tabla.pdf');
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
  // #################################################################
}
