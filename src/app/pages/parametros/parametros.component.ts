import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormGroup,FormBuilder,Validator, Validators} from '@angular/forms';
import{ SelectionModel} from '@angular/cdk/collections'
import $ from '../../../../node_modules/jquery';
import {Chart} from 'node_modules/chart.js'
import { from, Subscription } from 'rxjs';
import {Parametro} from '../../models/parametro.model';
import { ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ParametrosService } from 'src/app/services/parametros.service';
import { Router } from '@angular/router';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit,OnDestroy {

  @ViewChild(MatPaginator, {static:true}) paginator:MatPaginator;
  @ViewChild(MatSort, {static:true}) sort: MatSort;

  dataSource:MatTableDataSource<Parametro>;
  displayedColumns:string[]=['nombre','unidad_medida','indicador','id'];
  parametros:Parametro[]=[];
  parametrosSub:Subscription;

  constructor(private router: Router,private parametrosService : ParametrosService) { }

  ngOnInit() {
    this.parametrosService.getParametros();
    this.parametrosSub = this.parametrosService.getParametrosActualizadosListener()
      .subscribe((parametroData:{parametros: Parametro[]})=>{
        var paramAuxiliar:Parametro[]=[];
        parametroData.parametros.forEach(parametro => {
          if(parametro.indicador)
            paramAuxiliar.push(parametro);
        });
        this.parametros=paramAuxiliar;
        this.dataSource=new MatTableDataSource(this.parametros);
        this.dataSource.paginator= this.paginator;
        this.dataSource.sort = this.sort;
      });

  }

  ngOnDestroy() {
    this.parametrosSub.unsubscribe();
  }

  buscar(valor:string){
    this.dataSource.filter=valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onEdit(parametroId){
    this.router.navigate(["/parametros/editar/"+parametroId]);
  }

  onShow(parametroId){
    this.router.navigate(["/parametros/mostrar/"+parametroId]);
  }

  onDelete(parametroId){
    const id= parametroId;
    this.parametrosService.deleteParametro(id);
  }

}
