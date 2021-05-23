import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Medicion } from 'src/app/models/medicion.model';
import { MedicionesService } from '../../../../services/mediciones.service';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Time, dateFormat } from 'highcharts';
import { max } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-medicion-edit',
  templateUrl: './medicion-edit.component.html',
  styleUrls: ['./medicion-edit.component.scss']
})
export class MedicionEditComponent implements OnInit {
  today;
  form:FormGroup;
  isSubmited: boolean;
  medicion:Medicion;
  
  constructor(private route: ActivatedRoute,private medicionesServie: MedicionesService, private toastrService:ToastrService) { }

  ngOnInit() {    
    this.today=formatDate(Date.now(),'yyyy-MM-dd','en-US'); 
    this.form= new FormGroup({
      valor: new FormControl(null,{
        validators: [Validators.required],
      }),
      fecha: new FormControl(null,{
        validators:[Validators.required]
      }),
      hora: new FormControl(null,{
        validators:[Validators.required]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("medicion_id")){
        var medicionId= paramMap.get("medicion_id");

        this.medicionesServie.getMedicion(medicionId).subscribe((medicionData)=>{
          var re:RegExp= new RegExp("[ :-]");
          var arrDate:string[]= medicionData.medicion.fecha.split(re);

          this.medicion={
            id: medicionData.medicion.id,
            valor: medicionData.medicion.valor,
            fecha: medicionData.medicion.fecha,
            parametro: medicionData.medicion.parametro,
            zona: medicionData.medicion.zona
          };          

          this.form.setValue({
            valor: medicionData.medicion.valor,
            fecha: arrDate[0] + "-" + arrDate[1] + "-" + arrDate[2],
            hora: arrDate[3]+":"+arrDate[4]
          });
        });
      }
    });
  }

  onEditMedicion(){
    this.isSubmited=true;
    if (this.form.invalid) {
      this.toastrService.warning("Por favor ingrese correctamente todos los datos del formulario","Aviso!!!");
      return;
    }
    var string_date=this.form.value.fecha+' '+this.form.value.hora;
    var fecha = new Date(string_date);

    var med:Medicion={
      id: this.medicion.id,
      valor: this.form.value.valor,
      fecha: fecha,
      parametro: this.medicion.parametro.id,
      zona: this.medicion.zona.id
    };

    this.medicionesServie.updateMedicion(med);
  }
}
