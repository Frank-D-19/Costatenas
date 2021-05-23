import { Component, OnInit, ViewChild } from '@angular/core';
import {TipoDocumento} from '../../models/tipodocumento.model';
import {Documento} from '../../models/documento.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import $ from '../../../../node_modules/jquery';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-repositorio',
  templateUrl: './repositorio.component.html',
  styleUrls: ['./repositorio.component.scss']
})
export class RepositorioComponent implements OnInit {
  @ViewChild(MatPaginator, {static:true}) paginator:MatPaginator;

  form:FormGroup;
  formulario:FormGroup;
  modo='crear';
  documnetoSub:Subscription;
  tipo_documnetoSub:Subscription;
  tipo_documento:TipoDocumento[]=[];
  documentos:Documento[]=[];
  dataSource:MatTableDataSource<Documento>;

  constructor(private tipo_documentoService:TipoDocumentoService,private documentoService:DocumentosService) { }

  ngOnInit() {
    this.tipo_documentoService.getTipoDocumento();
    this.tipo_documnetoSub= this.tipo_documentoService.getTipoDocumentoListener()
    .subscribe((tipo_documentosData:{tipo_documento: TipoDocumento[]})=>{
      this.tipo_documento = tipo_documentosData.tipo_documento;
    });

    this.documentoService.getDocumento();
    this.documnetoSub= this.documentoService.getDocumentoListener()
    .subscribe((documentosData:{documento: Documento[]})=>{
      this.documentos = documentosData.documento;
    });

    this.formulario = new FormGroup({
      denominacion: new FormControl('', [Validators.required, Validators.minLength(5)]),
        tipo: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }



  open() {
    $('.modale').addClass('opened');
  }
  close() {
    $('.modale').removeClass('opened');
  }

}
