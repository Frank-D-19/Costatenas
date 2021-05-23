import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

import 'leaflet-draw';
import { Indicador } from 'src/app/models/indicador.model';
import { Parametro } from 'src/app/models/parametro.model';
import { Zona } from 'src/app/models/zona.model';
import { Subscription } from 'rxjs';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { Medicion } from '../../models/medicion.model';
import { MedicionesService } from '../../services/mediciones.service';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { MedicionCreateModalComponent } from './mediciones/medicion-create-modal/medicion-create-modal.component';
import { Mapa } from '../../clases/mapa/mapa';
import { CapaBase } from '../../models/capaBase.model';
import { CapasBasesService } from 'src/app/services/capas_bases.service';

const Backend_Zonas_Url = URL_API+"zonas";
const Backend_Mediciones_Url = URL_API+"mediciones";

declare let shp;
declare let L;

@Component({
  selector: 'app-geoportal',
  templateUrl: './geoportal.component.html',
  styleUrls: ['./geoportal.component.scss']
})
export class GeoportalComponent implements OnInit, OnDestroy {
  static map;
  static legend;
  static capas=[];
  static info={};
  indicadores: Indicador[]=[];
  static isInfo=false;
  static coordenadasControl;
  isSubmited:boolean=false;
  medicionForm:FormGroup;
  control_layers;
  parametros: Parametro[]=[];
  zonas: Zona[]=[];
  capasBase:CapaBase[];
  mapa:Mapa;

  private indicadoresSub:Subscription;
  private zonasSub:Subscription;
  private capasBaseSub:Subscription;

  constructor( private capasBasesService: CapasBasesService, private dialog: MatDialog , private toastrService:ToastrService, private router: Router,private http:HttpClient,private medicionesService:MedicionesService, private indicadoresService:IndicadoresService, private zonasService:ZonasService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/close.svg')
    );
  }

  getIsInfo(){
    if(this.mapa!=undefined)
      return this.mapa.getIsInfo();
  }
  getInfo(){
    if(this.mapa!=undefined)
      return this.mapa.getInfo();
  }

  hideInfo(){
   this.mapa.hideInfo();
  }

  cargarIndicadores(){
    this.indicadores=[];
    this.indicadoresService.getIndicadores();
    this.indicadoresSub = this.indicadoresService.getIndicadoresActualizadosListener()
      .subscribe((indicadorData:{indicadores: Indicador[]})=>{
        this.indicadores=indicadorData.indicadores;
        // this.crearMapa(this.indicadores);
        this.mapa.addIndicadoresToInfo(this.indicadores);
        this.addZonaToMap();
        // this.cargarZonas();
        // GeoportalComponent.info["indicadores"]= indicadorData.indicadores;
    });
  }

  cargarZonas(){
    this.zonasService.getZonas();
    this.zonasSub=this.zonasService.getZonasActualizadasListener()
      .subscribe((zonaData:{zonas: Zona[]})=>{
        this.zonas=zonaData.zonas;
        this.addZonaToMap();
        // for (let i = 0; i < this.zonas.length; i++)
        //   this.mapa.agregarZona(this.zonas[i]);
        // this.cargarCapas();
      });
  }

  cargarCapasBase(){
    this.capasBasesService.getCapasBases();
    this.capasBaseSub = this.capasBasesService.getCapasBasesActualizadasListener()
      .subscribe((capaBaseData:{capasBases: CapaBase[]})=>{
        this.capasBase=capaBaseData.capasBases;
        
        this.capasBase.forEach(capaBase => {
          var cb = L.tileLayer.wms(capaBase.url, {
            layers: capaBase.capa,
            format: 'image/png',
            transparent: true,
            attribution: capaBase.attribution
          });
          this.mapa.addBaseLayer(cb, capaBase.nombre);
        });
    });
  }

  addZonaToMap(){
    if(this.indicadores.length>0 && this.zonas.length>0){
      for (let i = 0; i < this.zonas.length; i++) {
        this.mapa.agregarZona(this.zonas[i]);
      }
    }
  }

  ngOnInit() {
    this.crearMapa();
    this.cargarCapasBase();
    this.cargarIndicadores();
    this.cargarZonas();
  }

  crearMapa(){
    this.mapa= new Mapa('map',[22.63936,-81.09833],9, false,null);
  }

  showMedicionForm(parametro: Parametro, zona: any){

    var par= this.getInfo()["parametros"].find(p=>p.id===parametro.id);

    const dialogRef= this.dialog.open(
      MedicionCreateModalComponent,
      {
        data:{
          parametro:par,
          zona: zona
        },
        width: '50%'
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        par.ultimaMedicion=result;
        this.mapa.updateInfo(par);
      }
    });
  }

  isDispensable(zona){
    var cont=0;

    zona.parametros.forEach(p => {
      if (p.ultimaMedicion.id==null)
        cont++;
    });

    if (cont==zona.parametros.length)
      return true
    return false;
  }

  onShowMediciones(zonaId, parId){
    this.router.navigate(["geoportal/mediciones/zona/"+zonaId+"/parametro/"+parId]);
  }

  onDeleteZona(zonaId){
    this.zonasService.deleteZona(zonaId, this.mapa);
    console.log(this.zonas);
  }

  ngOnDestroy() {
    if( this.zonasSub!=undefined)
      this.zonasSub.unsubscribe();
    if( this.indicadoresSub!=undefined)
      this.indicadoresSub.unsubscribe();
    if( this.capasBaseSub!=undefined)
      this.capasBaseSub.unsubscribe();
    if(this.mapa!=undefined)
      this.mapa.destroyMap();
  }
}

