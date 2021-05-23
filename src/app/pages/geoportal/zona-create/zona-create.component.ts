import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { IndicadorCreateModalComponent } from '../../indicadores/indicador-create-modal/indicador-create-modal.component';
import { Indicador } from 'src/app/models/indicador.model';
import { Parametro } from 'src/app/models/parametro.model';
import { Zona } from 'src/app/models/zona.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'leaflet-draw'
import { DomSanitizer } from '@angular/platform-browser';
import { Mapa } from '../../../clases/mapa/mapa';
import { CapasBasesService } from 'src/app/services/capas_bases.service';
import { CapaBase } from 'src/app/models/capaBase.model';

const assets = "../../../../assets/";
declare let shp;
declare let L;

@Component({
  selector: 'app-zona-create',
  templateUrl: './zona-create.component.html',
  styleUrls: ['./zona-create.component.scss']
})
export class ZonaCreateComponent implements OnInit,OnDestroy {

  
  mapa:Mapa;

  zona:Zona;
  modo='crear';
  isSubmited:boolean=false;
  indicadores: Indicador[]=[];
  form: FormGroup;
  control_layers;
  parametrosAgregar=[];
  indicadorAux:Indicador;
  pAux: Parametro[]=[];
  capasBase:CapaBase[];

  static toastr;
  private capasBaseSub:Subscription;
  private indicadoresSub:Subscription;

  constructor(private router: Router, private capasBasesService: CapasBasesService,private zonasService: ZonasService, private toastrService:ToastrService,
    private dialog: MatDialog, private indicadoresService:IndicadoresService,
    private route:ActivatedRoute, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, ) {
      iconRegistry.addSvgIcon(
        'importar',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/close.svg')
      );
    }

  ngOnInit() {
    this.form=new FormGroup({
      nombre: new FormControl(null, {
        validators: [ Validators.required, Validators.minLength(5)]
      }),
      indicadores: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    ZonaCreateComponent.toastr=this.toastrService;
    this.crearMapa();
    this.CargarCapasBase();
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has("zona_id")){
        this.modo='editar';
        var zonaId=paramMap.get("zona_id");
        this.zonasService.getZona(zonaId).subscribe((zonaData)=>{
          this.zona={
            id: zonaData.zona.id,
            nombre: zonaData.zona.nombre,
            geom: zonaData.zona.geom,
            parametros: zonaData.zona.parametros
          };

          //  this.indicadoresService.getIndicador(this.zona.parametros[0].indicador.id).subscribe((responseData)=>{
          //   this.indicadorAux=responseData.indicador;

          //   for (let index = 0; index < this.indicadorAux.parametros.length; index++) {
          //     this.pAux.push(this.indicadorAux.parametros[index]);
          //   }
          // });

          // this.zona.parametros.forEach(parametro => {
          //   if(parametro.is_active)
          //     this.parametrosAgregar.push(parametro);
          // });

          if(this.zona){
            this.cargarIndicadores();

            var figura;
            if(this.zona.geom.type=='Point')
            {
              var coordinates=this.zona.geom.coordinates;
              // var point=ZonaCreateComponent.invertirCoordenadasPunto(coordinates);
              var point=Mapa.invertirCoordenadasPunto(coordinates);

              figura=new L.Marker(point);
            }
            else if(this.zona.geom.type=='Polygon')
            {
              const coordinates=this.zona.geom.coordinates[0];
              // const coordenatesInv = ZonaCreateComponent.invertirCoordenadasPolygono(coordinates);
              const coordenatesInv = Mapa.invertirCoordenadasPolygono(coordinates);

              figura = new L.Polygon(coordenatesInv, {color:"red"});
            }

            // ZonaCreateComponent.drawItems.addLayer(figura);
            this.mapa.addToDrawItems(figura);
            var geometry=Mapa.getDrawItems().toGeoJSON();
            Mapa.setGeometry(geometry);
            Mapa.switchDrawControl();
            // ZonaCreateComponent.switchDrawControl(ZonaCreateComponent.drawItems);
          }
          else{
            console.log("la zona se demoro mucho en cargar");
          }
        });
      }
      else{
        this.modo='crear';
        this.cargarIndicadores();
      }
    });
  }

  getGeometry(){
    return Mapa.getGeometry();
  }

  getMap(){
    return this.mapa;
  }

  cargarIndicadores(){
    this.indicadoresService.getIndicadores();
    this.indicadoresSub = this.indicadoresService.getIndicadoresActualizadosListener()
    .subscribe((indicadorData:{indicadores: Indicador[]})=>{
      this.indicadores=indicadorData.indicadores;

      if(this.modo=='editar'){
        this.indicadorAux=this.indicadores.find(ind=>ind.id===this.zona.parametros[0].indicador.id);

        for (let index = 0; index < this.indicadorAux.parametros.length; index++) {
          this.pAux.push(this.indicadorAux.parametros[index]);
        }

        this.zona.parametros.forEach(parametro => {
          if(parametro.is_active)
            this.parametrosAgregar.push(parametro);
        });

        this.form.setValue({
          nombre: this.zona.nombre,
          indicadores:  this.indicadores[0]
        });
      }
    });
  }

  CargarCapasBase(){
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

  verIndicador(){
    this.pAux=[];
    this.indicadorAux= this.form.value.indicadores;

    for (let index = 0; index < this.indicadorAux.parametros.length; index++) {
      this.pAux.push(this.indicadorAux.parametros[index]);
    }
  }

  estaAgregar(parametro){
    const p = this.parametrosAgregar.find(P=> P.id ===parametro.id);
    if(p == undefined)
      return false;
    else
      return true;
  }

  agregarParametro(parametro){
    const p = this.parametrosAgregar.find(P=> P.id ===parametro.id);
    if(p == undefined)
      this.parametrosAgregar.push(parametro);
  }

  quitarParametro(parametro){
    const p = this.parametrosAgregar.find(P=> P.id ===parametro.id);
    if(p!= undefined){
      for (let i = 0; i < this.parametrosAgregar.length; i++) {
        if (parametro.id== this.parametrosAgregar[i].id) {
          this.parametrosAgregar.splice(i, 1);
        }
      }
    }
  }

  showIndicadorForm(){
    const dialogRef= this.dialog.open(IndicadorCreateModalComponent, { width: '50%' });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.indicadores.push(result);
      }
    });
  }

  crearMapa(){
    this.mapa= new Mapa('mapForm',[22.63936,-81.09833],6, true, this.toastrService);
  }

  onSaveZona(){
    this.isSubmited=true;
    if (this.parametrosAgregar.length<=0 || this.form.invalid || Mapa.getGeometry==null) {
      this.toastrService.warning("Por favor ingrese correctamente todos los datos del formulario","Aviso!!!");
      return;
    }

    var ps=this.parametrosAgregar;
    var p_id=[];
    ps.forEach(parametro => {
      p_id.push(parametro.id);
    });
    var zona: Zona={
      nombre:this.form.value.nombre,
      parametros: p_id,
      geom: Mapa.getGeometry()
    };

    if (this.modo=='crear') {
      this.zonasService.addZona(zona, this.form);
    }
    else{
      zona.id=this.zona.id;
      this.zonasService.updateZona(zona,  this.form);
    }

    this.router.navigate(["/geoportal"]);
  }

  ngOnDestroy() {
    if( this.indicadoresSub!=undefined)
      this.indicadoresSub.unsubscribe();
    if( this.capasBaseSub!=undefined)
      this.capasBaseSub.unsubscribe();
    if(this.mapa!=undefined)
    this.mapa.destroyMap();
  }

}
