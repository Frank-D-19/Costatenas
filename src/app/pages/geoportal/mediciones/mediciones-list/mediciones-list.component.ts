import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Parametro } from 'src/app/models/parametro.model';
import { Medicion } from 'src/app/models/medicion.model';
import { Subscription } from 'rxjs';
import { MedicionesService } from 'src/app/services/mediciones.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import * as Highcharts from 'highcharts';
import { Zona } from 'src/app/models/zona.model';

@Component({
  selector: 'app-mediciones-list',
  templateUrl: './mediciones-list.component.html',
  styleUrls: ['./mediciones-list.component.scss']
})
export class MedicionesListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static:true}) paginator:MatPaginator;

  parametroId;
  zonaId;
  isLoading=true;
  parametro:Parametro;
  zona:Zona;
  mediciones:Medicion[]=[];
  dataSource:MatTableDataSource<Medicion>;
  displayedColumns:string[]=['fecha','valor','id'];

  highcharts = Highcharts;
  data=[];

  chartOptions = {}

  medicionesSub:Subscription;

  constructor(private medicionesService:MedicionesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if (paramMap.has('parametroId') && paramMap.has('zonaId')) {
        this.parametroId=paramMap.get('parametroId');
        this.zonaId=paramMap.get('zonaId');
      }

      this.cargarMediciones(this.parametroId, this.zonaId);
    });
  }

  cargarMediciones(parametroId, zonaId){
    this.medicionesService.getMedicionesXzonaXparametro(parametroId,zonaId);
    this.medicionesSub = this.medicionesService.getMedicionesActualizadasListener()
      .subscribe((medicionesData:{mediciones: Medicion[]})=>{
        this.isLoading=false;
        this.zona=medicionesData.mediciones[0].zona;
        this.parametro=medicionesData.mediciones[0].parametro;
        var data_xAxis=[];
        var data_yAxis:number[]=[];
        var arr:string[]=[];
        for (let i = 0; i < medicionesData.mediciones.length; i++) {
          data_yAxis.push(medicionesData.mediciones[i].valor);
          arr.push(medicionesData.mediciones[i].fecha.toString());
        }

        var re:RegExp= new RegExp("[ :-]");
        var a:[]
        var arr_arr_string=[];
        arr.forEach(element => {
          var q:string[]= element.split(re);
          arr_arr_string.push(q);
        });
        var arr_arr_number=[];
        arr_arr_string.forEach(element => {
          var n:number[]=[];
          element.forEach(item => {
            n.push(Number.parseInt(item));
          });
          arr_arr_number.push(n);
        });

        arr_arr_number.forEach(item=>{
          var fecha =Date.UTC(item[0],item[1]-1,item[2],item[3],item[4],item[5]);
          data_xAxis.push(fecha);
        });
        data_xAxis.reverse();
        data_yAxis.reverse();

       for (let i = 0, j = 0; i < data_xAxis.length; i++, j++) {
          const a = [data_xAxis[i],data_yAxis[j]];
          this.data.push(a);
       }

        this.chartOptions={
          chart: {
            type:'spline',
            zoomType: 'x'
          },
          title: {
            text: 'Comportamiento del parametro ' + this.parametro.nombre + ' en la zona '
          },
          subtitle: {
            text: document.ontouchstart === undefined ?
            'Haga click y arrastre en el área del gráfico que quiera acercar' :
            'Haga click en el gráfico para cercar'
          },
          xAxis:{
            type: 'datetime',
            dateTimeLabelFormats:{
              month: '%e. %b',
              year: '%b'
            },
            minRange: 14 * 24 * 3600000 // fourteen days
          },
          yAxis: {
            title:{
            text: 'Valor de la medición ( ' + this.parametro.unidad_medida.nombre + ')'
            },
            min:0
          },
          tooltip: {
             valueSuffix: this.parametro.unidad_medida.nombre
          },
          plotOptions : {
            series: {
              marker: {
                enabled: true
              }
            },
             area: {
                fillColor: {
                   linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                   stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, new Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                   ]
                },
                marker: {
                   radius: 4
                },
                lineWidth: 3,
                states: {
                   hover: {
                      lineWidth: 3
                   }
                },
                threshold: null
             }
          },
          series:[{
             type: 'area',
             name: this.parametro.nombre,
             pointInterval: 24 * 3600 * 1000,
             data: this.data
          }]
        };

        this.mediciones=medicionesData.mediciones;
        this.dataSource=new MatTableDataSource(this.mediciones);
        this.dataSource.paginator= this.paginator
    });
  }

  buscar(valor:string){
    this.dataSource.filter=valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.medicionesSub.unsubscribe();
  }

}
