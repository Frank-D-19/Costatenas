import { Component, OnInit, ViewChild , OnDestroy} from '@angular/core';
import {FormGroup,FormBuilder,Validator, Validators} from '@angular/forms';
import{ SelectionModel} from '@angular/cdk/collections'
import $ from '../../../../node_modules/jquery';
import { from, Subscription } from 'rxjs';
import {Indicador} from '../../models/indicador.model';
import { ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { IndicadoresService } from '../../services/indicadores.service';
import { Router } from '@angular/router';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';


@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.scss']
})
export class IndicadoresComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator, {static:true}) paginator:MatPaginator;
  @ViewChild(MatSort, {static:true}) sort: MatSort;

  dataSource:MatTableDataSource<Indicador>;
  displayedColumns:string[]=['nombre','creado', 'actualizado', 'color','id'];
  indicadores:Indicador[]=[];
  indicadoresSub:Subscription;

  constructor(private router: Router,private indicadoresService:IndicadoresService) { }

  ngOnInit() {

    this.indicadoresService.getIndicadores();
    this.indicadoresSub = this.indicadoresService.getIndicadoresActualizadosListener()
      .subscribe((indicadorData:{indicadores: Indicador[]})=>{
        this.indicadores=indicadorData.indicadores;
        this.dataSource=new MatTableDataSource(this.indicadores);
        this.dataSource.paginator= this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  buscar(valor:string){
    this.dataSource.filter=valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(indicadorId){
    this.router.navigate(["/indicadores/editar/"+indicadorId]);
  }

  onShow(indicadorId){
    this.router.navigate(["/indicadores/mostrar/"+indicadorId]);
  }

  onDelete(indicadorId){
    const id= indicadorId;
    if(confirm("Seguro que desea eliminar el objeto?"))
    this.indicadoresService.deleteIndicador(indicadorId);
  }

  ngOnDestroy() {
    this.indicadoresSub.unsubscribe();
  }

//   constructor(private frmBuilder:FormBuilder,private toastr: ToastrService) {
//     this.formulario=this.frmBuilder.group({
//       denominacion:['nombre', Validators.required],
//       medicion:['valor de medicion',Validators.required],
//       descripcion:['descripcion', Validators.required]
//     });
//    }

//   formulario:FormGroup;
// /*******************************Cargar Ventanas*****************************************************/
//   open() {
//     $('.modale').addClass('opened');
//   }
//   close() {
//     $('.modale').removeClass('opened');
//   }
//   showchart() {
//     $('.modale-chart').addClass('opened-chart');
//   }
//   chartclose() {
//     $('.modale-chart').removeClass('opened-chart');
//   }
//   delete() {
//   $('.modale-delete').addClass('opened-delete');
//      this.indicadorArray= this.indicadorArray.filter(x=>x != this.createIndicador);
//      this.createIndicador=new Indicador();
//   }
//   deleteclose() {
//     $('.modale-delete').removeClass('opened-delete');
//   }
// /***************************************Datos************************************************************/
// indicadorArray: Indicador[]=[
//   {id: 1, denominacion:"Concentracion de Plomo", descripcion:"Descripcion 1", medicion:20},
//   {id: 2, denominacion:"Concentracion de Magnesio", descripcion:"Descripcion 2", medicion:30},
//   {id: 3, denominacion:"Concentracion de Calcio", descripcion:"Descripcion 3", medicion:25}
// ]
// /***************************************CRUD**************************************************************/


//    createIndicador: Indicador= new Indicador();
// updateIndicador(indicador:Indicador){
//  this.createIndicador = indicador;
//   $('.modale').addClass('opened');
// }
//  showto(){
//   this.toastr.success("Hello, I'm the toastr message.")
//  }
//    onSumbit(){
//     if(this.createIndicador.id===0 && this.createIndicador.denominacion!= null){
//     this.createIndicador.id=this.indicadorArray.length + 1;
//     if(this.indicadorArray.push(this.createIndicador)){
//      $('.modale').removeClass('opened')
//     }
//    }else{
//     this.createIndicador=new Indicador();
//     $('.modale').removeClass('opened')
//     alert("El indicador ha sido modificado correctamente ")
//    }
//    }
//   ngOnInit() {
// *********************************CHART*********************************************************************/
// var chart    = document.getElementById('chart')

// var data  = {
// labels: [ '2014', '2015', '2016', '2017', '2018', '2019' ],
// datasets: [
//   {
//   label: 'Parametro#1',
//   pointBackgroundColor: 'red',
//   borderWidth: 1,
//   borderColor: 'red',
//   backgroundColor:'transparent',
//   data: [50, 55, 80, 81, 54, 50]
// },
// {
//   label: 'Parametro#2',
//   pointBackgroundColor: 'green',
//   borderWidth: 1,
//   borderColor: 'green',
//   backgroundColor:'transparent',
//   data: [10, 35, 90, 41, 74, 20]
// },
// {
//   label: 'Parametro#3',
//   pointBackgroundColor: 'blue',
//   borderWidth: 1,
//   borderColor: 'blue',
//   backgroundColor:'transparent',
//   data: [79, 95, 50, 71, 34, 90]
// }
// ]
// };


// var options = {
// responsive: true,
// maintainAspectRatio: true,
// animation: {
// easing: 'easeInOutQuad',
// duration: 520
// },
// scales: {
// xAxes: [{
//   gridLines: {
//     color: 'rgba(200, 200, 200, 0.1)',
//     lineWidth: 1
//   }
// }],
// yAxes: [{
//   gridLines: {
//     color: 'rgba(200, 200, 200, 0.1)',
//     lineWidth: 1
//   }
// }]
// },
// elements: {
// line: {
//   tension: 0
// }
// },
// legend: {
// display: true
// },
// point: {
// backgroundColor: 'white'
// },
// tooltips: {
// titleFontFamily: 'Arial',
// backgroundColor: 'rgba(0,0,0,0.5)',
// titleFontColor: 'white',
// caretSize: 5,
// cornerRadius: 2,
// xPadding: 10,
// yPadding: 10
// }
// };
// var chartInstance = new Chart(chart, {
// type: 'line',
// data: data,
// options: options
// });
//   }
 }
