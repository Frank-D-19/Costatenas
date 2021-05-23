import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Mapa } from '../../../../clases/mapa/mapa';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CapaBase } from '../../../../models/capaBase.model';
import { CapasBasesService } from 'src/app/services/capas_bases.service';

const assets = "../../../../assets/";

@Component({
  selector: 'app-capa-base-create',
  templateUrl: './capa-base-create.component.html',
  styleUrls: ['./capa-base-create.component.scss']
})
export class CapaBaseCreateComponent implements OnInit,OnDestroy {
  modo='crear';
  isSubmited:boolean=false;
  form:FormGroup;
  // mapa:Mapa;

  shapesSub:Subscription;
  capaBase: CapaBase;

  constructor(private router: Router,private route:ActivatedRoute, private toastr:ToastrService, private capasBasesService: CapasBasesService) { }

  ngOnInit() {
    this.form=new FormGroup({
      nombre: new FormControl(null, {
        validators: [ Validators.required, Validators.minLength(5)]
      }),
      url: new FormControl(null, {
        validators: [Validators.required]
      }),
      capa: new FormControl(null, {
        validators: [ Validators.required]
      }),
      attribution: new FormControl(null, {})
    });

    this.route.paramMap.subscribe((parameMap:ParamMap)=>{
      if(parameMap.has("capaBase_id")){
        this.modo='editar';
        var capaBaseId=parameMap.get("capaBase_id");
        this.capasBasesService.getCapaBase(capaBaseId).subscribe((capabaseData)=>{
          this.capaBase= { 
            id: capabaseData.capaBase.id,
            nombre: capabaseData.capaBase.nombre,
            url: capabaseData.capaBase.url,
            capa: capabaseData.capaBase.capa,
            attribution: capabaseData.capaBase.attribution
          };
          
          this.form.setValue({
            'nombre': this.capaBase.nombre,
            'url': this.capaBase.url,
            'capa': this.capaBase.capa,
            'attribution': this.capaBase.attribution
          });
        });
      }
      else{
        this.modo='crear';
      }
    });
  }

  onSaveCapaBase(){
    this.isSubmited=true;
    if (this.form.invalid) {
      this.toastr.warning('Por favor llene todos los campos obligatorios del formulario',"Aviso");
      return;
    }

    var capaBase:CapaBase;

    if(this.modo=='crear'){
      capaBase = {
        nombre: this.form.value.nombre, 
        url: this.form.value.url,
        capa: this.form.value.capa,
        attribution: this.form.value.attribution
      };

      this.capasBasesService.addCapaBase(capaBase);
    }
    else{
      capaBase = {
        id: this.capaBase.id,
        nombre: this.form.value.nombre,
        url: this.form.value.url,
        capa: this.form.value.capa,
        attribution: this.form.value.attribution
      };
      
      this.capasBasesService.updateCapaBase(capaBase);
    }

    this.router.navigate(["geoportal/capasBase"]);
  }

  ngOnDestroy(): void {
    if (this.shapesSub)
      this.shapesSub.unsubscribe();
  }
}
