import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder,Validator, Validators} from '@angular/forms';
import{ SelectionModel} from '@angular/cdk/collections'
import $ from '../../../../node_modules/jquery';
import {Chart} from 'node_modules/chart.js'
import { from } from 'rxjs';
import {Proyecto} from '../../models/proyecto';
import { ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  constructor(private frmBuilder:FormBuilder,private toastr: ToastrService) {
    this.formulario=this.frmBuilder.group({
      denominacion:['', Validators.required],
      descripcion:['', Validators.required]
    });
   }
   formulario:FormGroup;

  ngOnInit() {
  }

  /*******************************Cargar Ventanas*****************************************************/
  open() {
    $('.modale').addClass('opened');
  }
  close() {
    $('.modale').removeClass('opened');
  }
  showchart() {
    $('.modale-chart').addClass('opened-chart');
  }
  chartclose() {
    $('.modale-chart').removeClass('opened-chart');
  }
  delete() {
  $('.modale-delete').addClass('opened-delete');
  }
  deleteclose() {
    $('.modale-delete').removeClass('opened-delete');
  }
}
