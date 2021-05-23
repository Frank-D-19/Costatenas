import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Medicion } from 'src/app/models/medicion.model';
import { URL_API } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Parametro } from '../../../../models/parametro.model';
import { formatDate } from '@angular/common';

const Backend_Mediciones_Url=URL_API+"mediciones";

@Component({
  selector: 'app-medicion-create-modal',
  templateUrl: './medicion-create-modal.component.html',
  styleUrls: ['./medicion-create-modal.component.scss']
})
export class MedicionCreateModalComponent implements OnInit {

  today;
  form:FormGroup;
  isSubmited: boolean;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:{parametro: Parametro,zona:any},private toastrService:ToastrService, private http:HttpClient, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public dialogRef: MatDialogRef<MedicionCreateModalComponent>) { 
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/close.svg')
    );
  }

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
  }

  closeDialog(){
    this.dialogRef.close();
  }

  onSaveMedicion(){
    this.isSubmited=true;
    if (this.form.invalid) {
      this.toastrService.warning("Por favor ingrese correctamente todos los datos del formulario","Aviso!!!");
      return;
    }
    var string_date=this.form.value.fecha+' '+this.form.value.hora;
    var fecha = new Date(string_date);

    var med:Medicion={
      valor: this.form.value.valor,
      fecha: fecha,
      parametro: this.data.parametro.id,
      zona: this.data.zona.id
    };
    
    this.http.post<{mensaje:string, medicion:Medicion}>(Backend_Mediciones_Url, med)
      .subscribe(responseData=>{
        var m:Medicion={
          id: responseData.medicion.id,
          valor: responseData.medicion.valor,
          fecha: responseData.medicion.fecha,
        };

        this.dialogRef.close(m);
    });
  }

}
