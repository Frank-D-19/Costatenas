import { Zona } from '../../models/zona.model';
import { Indicador } from 'src/app/models/indicador.model';
import { Parametro } from '../../models/parametro.model';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
declare let shp;
declare let L;
const assets = "../../../assets/";

export class Mapa {

  //
  // Atributos
  //
  private static map;
  private static legend;
  private static drawItems;
  private static draw_control;
  private scale;
  private static fileUploaderControl;
  private static control_layers;
  private static geometry;
  private static coordenadasControl;
  private static toastr:ToastrService;
  static shape:{nombre:string, style:{fillColor:string, color:string, fillOpacity:number, opacity:number, weight:number}};
  static info={};
  static isInfo=false;
  static indicadores: Indicador[]=[];
  zonas: Zona[]=[];
  //
  // Propiedades
  //
  static getGeometry(){
    return this.geometry;
  }
  static setGeometry(geometry){
    Mapa.geometry=geometry;
  }

  static getDrawItems(){
    return Mapa.drawItems;
  }
  //
  //Constructor
  //
  constructor(mapContainer:string, view:number[], zoomLevel:number, isDraw:boolean, toastr:ToastrService){
    // if(indicadores!=undefined){
    //   Mapa.indicadores=indicadores;
    //   Mapa.info["indicadores"]= indicadores;
    // }
    Mapa.toastr=toastr;
    Mapa.map= new L.map(mapContainer).setView(view,zoomLevel);
    Mapa.map.on('mousemove', function(ev) {
      Mapa.coordenadasControl.update(ev.latlng.lat.toPrecision(7),ev.latlng.lng.toPrecision(7));
    });

    Mapa.map.on('zoomend',function(e){
      console.log(Mapa.map.getZoom());
    });

    Mapa.drawItems = new L.FeatureGroup()

    Mapa.coordenadasControl= new L.control({position: 'bottomright'});
    Mapa.coordenadasControl.onAdd=function(){
      this._div= L.DomUtil.create('div','coordenadas');
      this.update(22.63936,-81.09833);
      return this._div;
    };
    Mapa.coordenadasControl.update=function(latitud, longitud){
      this._div.innerHTML='<p style="background-color:#fff;border-radius:3px;padding-right:5px;padding-left:5px">Latitid: ' + latitud.toString() + ' Longitud: ' + longitud.toString() +'</p>';
    };

    this.scale= new L.control.scale({
      metric:true,
      imperial: false
    });

    Mapa.control_layers=new L.control.layers({},{},{
      collapsed:true,
      hideSingleBase:false
    });

    if(isDraw==true){
      Mapa.createDrawControl();
      this.crearFileUploadButton(Mapa.toastr);
    }

    this.addControlToMap();
  }

  //
  //Métodos
  //
  private addControlToMap(){
    Mapa.drawItems.addTo(Mapa.map);
    Mapa.coordenadasControl.addTo(Mapa.map);
    this.scale.addTo(Mapa.map);
    Mapa.control_layers.addTo(Mapa.map);
  }

  crearFileUploadButton(toastr){
    Mapa.fileUploaderControl = new L.Control({position:"topleft"});

    Mapa.fileUploaderControl.onAdd=function(map){
      var button= new L.DomUtil.create('button','fileUploader');

      var html= '<i class="fa fa-folder-open" style="margin-top:10px"></i><input id="filePicker" style="visibility:hidden" type="file" multiple>'
      button.style.cursor = "pointer";
      button.setAttribute('title','Importar shape');
      button.style.color= "#404040";
      button.style.backgroundColor = "white";
      button.style.borderRadius = "5px";
      button.style.height = "35px";
      button.style.width = "34px";
      button.style.border = "2px solid #AAA";
      
      button.onmouseover=function(){
        button.style.backgroundColor="#f4f4f4";
      };
      button.onmouseleave=function(){
        button.style.backgroundColor="white";        
      };
      button.onclick=function(){
       document.getElementById('filePicker').click();   

       document.getElementById('filePicker').onchange= function(event:Event){
          var fileSelected= (event.target as HTMLInputElement).files[0];
          var re:RegExp= new RegExp("[.]");

          const ultElem=fileSelected.name.split(re).length-1;
          const ext = fileSelected.name.split(re)[ultElem];
          if(ext!='shp'){
            toastr.warning('El archivo deben ser de extensiones .shp','Aviso');
            return;
          }
          const readerShp = new FileReader();

          readerShp.onload=()=>{
            Mapa.showShapeByData(shp.parseShp(readerShp.result), toastr);
          };
          readerShp.readAsArrayBuffer(fileSelected);
        };          
      };
      
      button.innerHTML=html;
      return button;
    };
    Mapa.fileUploaderControl.addTo(Mapa.map);
  }

  public addIndicadoresToInfo(indicadores:Indicador[]){
    if(indicadores!=undefined){
      Mapa.indicadores=indicadores;
      Mapa.info["indicadores"]= indicadores;
    }
  }

  public static createDrawControl(){
    this.draw_control = new L.Control.Draw({
      draw: {
        polygon:{
          showArea :true,
          shapeOptions:{
            color: 'red'
          }
        },
        polyline: false,
        circle: false,
        rectangle: false,
        circlemarker: false
      }
    });

    Mapa.map.addControl(Mapa.draw_control);

    this.map.on(L.Draw.Event.CREATED, function(event){
      const layer = event.layer;
      Mapa.drawItems.addLayer(layer);
      Mapa.geometry = Mapa.drawItems.toGeoJSON();
      Mapa.switchDrawControl();
    });
  }

  public static switchDrawControl(){
    this.draw_control.remove(this.map);

    Mapa.draw_control=new L.Control.Draw({
      draw:false,
      edit:{
        featureGroup: this.drawItems
      }
    });

    this.map.addControl(this.draw_control);

    this.map.on('draw:edited', function(event){
      const layers = event.layers;
      layers.eachLayer(function (layer) {
        Mapa.drawItems.addLayer(layer);
        Mapa.geometry = Mapa.drawItems.toGeoJSON();
      });
    });

    this.map.on('draw:deleted', function(){
      if(Mapa.drawItems.getLayers().length<=0){
        Mapa.geometry=null;
        Mapa.draw_control.remove(Mapa.map);
        Mapa.createDrawControl();
      }
    });
  }

  addBaseLayer(layer:any, nombre:string){
    Mapa.control_layers.addBaseLayer(layer,nombre);
    Mapa.map.addLayer(layer);
  }

  agregarZona(zona:Zona){
    var geoJSON= new L.geoJSON( zona.geom , {
      id: zona.id,
      nombre: zona.nombre,
      parametros: zona.parametros
      }
    );

    geoJSON.on('click', function(e){
      var options=e.target.options;
    Mapa.showInfo(options);
    });

    geoJSON.addTo(Mapa.map);
    this.zonas.push(zona);
    Mapa.control_layers.addOverlay(geoJSON, geoJSON.options.nombre);
  }

  getIsInfo(){
    return Mapa.isInfo;
  }

  getInfo(){
    return Mapa.info;
  }

  private static showInfo(datosZona){
    Mapa.isInfo=true;
    Mapa.info=datosZona;
    var inds_id=[];
    var inds=[];

    datosZona.parametros.forEach(parametro => {
      if(!inds_id.includes(parametro.indicador.id))
        inds_id.push(parametro.indicador.id);
    });

    inds_id.forEach(id => {
      Mapa.indicadores.forEach(indi => {
        if(id==indi.id)
          inds.push(indi);
      });
    });
    Mapa.info["indicadores"]=inds;
  }

  hideInfo(){
    Mapa.isInfo=false;
    Mapa.info={};
  }

  removeZona(zonaId){
    Mapa.map.eachLayer(function(layer){
      if(zonaId==layer.options.id){
        layer.remove();
        Mapa.isInfo=false;
        Mapa.info={};
        var index =this.zonas.findIndex(z=> z.id ===zonaId);
        this.zonas.splice(index,1);
      }
    });
  }

  static showShapeByData(data, toastr){
    const isValid=Mapa.isValidData(data);

    if (isValid==true) {
      var figura;
      if (data[0].type=='Polygon') {
        const coordenadas=Mapa.invertirCoordenadasPolygono(data[0].coordinates[0]);
        figura = new L.Polygon(coordenadas,{color:"red"});
      }
      else if(data[0].type=='Point'){
        const punto=Mapa.invertirCoordenadasPunto(data[0].coordinates);
        figura= new L.Marker(punto);
      }
      figura.addTo(Mapa.map);
      if (Mapa.drawItems.getLayers().length>0)
        Mapa.drawItems.clearLayers();

      Mapa.drawItems.addLayer(figura);
      Mapa.geometry =  Mapa.drawItems.toGeoJSON();
      Mapa.switchDrawControl();
    }
    else{
      toastr.warning(isValid,"Error al importar el archivo .shp!!!");
    }
  }

  static isValidData(data){
    var isValid=false;
    var mensaje='';
    if(data.length==1){
      if (data[0].type=='Polygon' || data[0].type=='Point') {
        if (data[0].type=='Polygon') {
          if(data[0].coordinates.length==1){
            if(data[0].coordinates[0].length>=3){
              isValid=true;
            }
            else{
              mensaje='El polígono debe tener al menos tres pares de coordenadas';
            }
          }
          else{
            mensaje='El archivo no tiene la estructura adecuada';
          }
        }
        else if(data[0].type=='Point'){
          if(data[0].coordinates.length==2){
            isValid=true;
          }
          else{
            mensaje='El punto debe tener un solo par de coordenadas';
          }
        }
        if(data[0].coordinates.length==1){
        }
      }
      else{
      mensaje='La figura debe se un polígono o un punto';
      }
    }
    else{
      mensaje='El archivo debe constener una sola figura';
    }

    if (isValid==false)
      return mensaje;
    else
      return isValid
  }

  static invertirCoordenadasPolygono(coordenadas){
    var coordinates=[];

    for (let i = 0; i < coordenadas.length; i++) {
      var x=coordenadas[i][1];
      var y=coordenadas[i][0];

      const vertice=[];
      vertice.push(x);
      vertice.push(y);

      coordinates.push(vertice);
    }

    return coordinates;
  }

  static invertirCoordenadasPunto(coordenadas){
    var point=[];

    var x=coordenadas[1];
    var y=coordenadas[0];

    point.push(x);
    point.push(y);

    return point;
  }

  public addToDrawItems(layer){
    Mapa.drawItems.addLayer(layer);
  }

  public updateInfo(parametro:Parametro){
    var p:Parametro=Mapa.info["parametros"].find(p=>p.id===parametro.id);
    p.ultimaMedicion=parametro.ultimaMedicion;
  }

  public destroyMap(){
    if( Mapa.map!=undefined){
      Mapa.map.remove();
      Mapa.map=null;
    }
    if(Mapa.isInfo!=false)
      this.hideInfo();
    if(Mapa.legend)
      Mapa.legend=null;
    if(Mapa.drawItems)
      Mapa.drawItems=null;
    if(Mapa.draw_control)
      Mapa.draw_control=null;
    if(Mapa.control_layers)
      Mapa.control_layers=null;
    if(this.scale)
      this.scale=null;
    if(Mapa.geometry)
      Mapa.geometry=null;
    if(Mapa.coordenadasControl)
      Mapa.coordenadasControl=null;
    if(Mapa.indicadores)
      Mapa.indicadores=null;
    if(Mapa.fileUploaderControl)
      Mapa.fileUploaderControl=null;
    if(Mapa.toastr)
      Mapa.toastr=null;
    if(Mapa.shape)
      Mapa.shape=null;
    if(Mapa.indicadores)
      Mapa.indicadores=null;
  }
}
