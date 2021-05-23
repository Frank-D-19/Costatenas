import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { CapaBase } from '../../../../models/capaBase.model';
import { CapasBasesService } from '../../../../services/capas_bases.service';
import { Mapa } from '../../../../clases/mapa/mapa';

@Component({
  selector: 'app-capas-base-list',
  templateUrl: './capas-base-list.component.html',
  styleUrls: ['./capas-base-list.component.scss']
})
export class CapasBaseListComponent implements OnInit {
  @ViewChild(MatPaginator, {static:true}) paginator:MatPaginator;

  dataSource:MatTableDataSource<CapaBase>;
  displayedColumns:string[]=['nombre','id'];
  capasBases:CapaBase[]=[];
  capaBasesSub:Subscription;

  constructor(private capasBasesServices:CapasBasesService) { }

  ngOnInit() {
    this.capasBasesServices.getCapasBases();
    this.capaBasesSub = this.capasBasesServices.getCapasBasesActualizadasListener()
      .subscribe((capaBaseData:{capasBases: CapaBase[]})=>{
        this.capasBases=capaBaseData.capasBases;
        this.dataSource=new MatTableDataSource(this.capasBases);
        this.dataSource.paginator= this.paginator;
    });
  }

  buscar(valor:string){
    this.dataSource.filter=valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(capaBaseId){
    const id= capaBaseId;
    this.capasBasesServices.deleteCapaBase(id);
  }

  ngOnDestroy() {
    this.capaBasesSub.unsubscribe();
  }
}
