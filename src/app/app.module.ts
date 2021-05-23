import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';
//import { HighchartsChartModule } from 'highcharts-angular';
import {AuthenticationService} from './services/authentication.service';
import {StorageService} from './services/storage.service';
import {TipoDocumentoService} from './services/tipo-documento.service';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { IndicadoresComponent } from './pages/indicadores/indicadores.component';
import { GeoportalComponent } from './pages/geoportal/geoportal.component';
import { ProyectosComponent } from './pages/proyectos/proyectos.component';
import { RepositorioComponent } from './pages/repositorio/repositorio.component';
import { LoginComponent } from './auth/login/login.component';
import { NotificationsComponent } from './auth/notifications/notifications.component';
import { IndicadoresHeaderComponent } from './pages/indicadores/indicadores-header/indicadores-header.component';
import { IndicadorCreateComponent } from './pages/indicadores/indicador-create/indicador-create.component';
import { IndicadorShowComponent } from './pages/indicadores/indicador-show/indicador-show.component';
import { MedicionesListComponent } from './pages/geoportal/mediciones/mediciones-list/mediciones-list.component';
import { IndicadorCreateModalComponent } from './pages/indicadores/indicador-create-modal/indicador-create-modal.component';
import { ParametroCreateModalComponent } from './pages/parametros/parametro-create-modal/parametro-create-modal.component';
import { GeoportalHeaderComponent } from './pages/geoportal/geoportal-header/geoportal-header.component';
import { CapasBaseListComponent } from './pages/geoportal/capas-base/capas-base-list/capas-base-list.component';
import { CapaBaseCreateComponent } from './pages/geoportal/capas-base/capa-base-create/capa-base-create.component';
import { ZonaCreateComponent } from './pages/geoportal/zona-create/zona-create.component';
import { HighchartsChartComponent } from 'highcharts-angular';
import { MedicionCreateModalComponent } from './pages/geoportal/mediciones/medicion-create-modal/medicion-create-modal.component';
import { MedicionEditComponent } from './pages/geoportal/mediciones/medicion-edit/medicion-edit.component';
import {Routing} from "./app.routing";
import { AdminComponent } from './auth/login/admin/admin.component';
import { SessionComponent } from './auth/login/session/session.component';
import { ErrorInterceptor } from './error-interceptor';
import { ParametroShowComponent } from './pages/parametros/parametro-show/parametro-show.component';
import { ParametrosHeaderComponent } from './pages/parametros/parametros-header/parametros-header.component';
import { ParametrosComponent } from './pages/parametros/parametros.component';
import { ParametroCreateComponent } from './pages/parametros/parametro-create/parametro-create.component';
import { CreateWorkspaceComponent } from './pages/geoportal/create-workspace/create-workspace.component';
import { CapaCreateComponent } from './pages/geoportal/capa-create/capa-create.component';




@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    IndicadoresComponent,
    GeoportalComponent,
    ProyectosComponent,
    RepositorioComponent,
    LoginComponent,
    NotificationsComponent,
    IndicadoresHeaderComponent,
    IndicadorCreateComponent,
    IndicadorShowComponent,
    MedicionesListComponent,
    IndicadorCreateModalComponent,
    ParametroCreateModalComponent,
    GeoportalHeaderComponent,
    CapasBaseListComponent,
    CapaBaseCreateComponent,
    ZonaCreateComponent,
    HighchartsChartComponent,
    MedicionCreateModalComponent,
    MedicionEditComponent,
    AdminComponent,
    SessionComponent,
    ParametroShowComponent,
    ParametrosHeaderComponent,
    ParametrosComponent,
    ParametroCreateComponent,
    CreateWorkspaceComponent,
    CapaCreateComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    ToastrModule.forRoot(),
    ChartsModule,
    Routing,
    //HighchartsChartModule
  ],
  entryComponents:[
    IndicadorCreateModalComponent,
    ParametroCreateModalComponent,
    MedicionCreateModalComponent
  ],
  providers: [
    TipoDocumentoService,
    AuthenticationService,
    StorageService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
