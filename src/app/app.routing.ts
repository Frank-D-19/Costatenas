import { Routes,RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { IndicadoresComponent } from './pages/indicadores/indicadores.component';
import { GeoportalComponent } from './pages/geoportal/geoportal.component';
import {ParametrosComponent} from "./pages/parametros/parametros.component";
import { ProyectosComponent } from './pages/proyectos/proyectos.component';
import { RepositorioComponent } from './pages/repositorio/repositorio.component';

import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './auth/login/admin/admin.component';
//import {AuthorizatedGuard} from "./auth/login/guards/authorizated.guard";

import { IndicadorCreateComponent } from './pages/indicadores/indicador-create/indicador-create.component';
import { IndicadorShowComponent } from './pages/indicadores/indicador-show/indicador-show.component';
import { MedicionesListComponent } from './pages/geoportal/mediciones/mediciones-list/mediciones-list.component';
import { CapasBaseListComponent } from './pages/geoportal/capas-base/capas-base-list/capas-base-list.component';
import { CapaBaseCreateComponent } from './pages/geoportal/capas-base/capa-base-create/capa-base-create.component';
import { ZonaCreateComponent } from './pages/geoportal/zona-create/zona-create.component';
import { MedicionEditComponent } from './pages/geoportal/mediciones/medicion-edit/medicion-edit.component';
import {AutenticacionGuard} from './auth/login/autenticacion/autenticacion.guard'
import {ParametroShowComponent} from "./pages/parametros/parametro-show/parametro-show.component";
import {ParametroCreateComponent} from "./pages/parametros/parametro-create/parametro-create.component";
import {CreateWorkspaceComponent} from "./pages/geoportal/create-workspace/create-workspace.component";
import {CapaCreateComponent} from "./pages/geoportal/capa-create/capa-create.component";

export const AppRoutes: Routes = [

  {
    path: '',
    component: LoginComponent
  },
  /* { path: 'login', component: LoginComponent/*, canActivate: [ AuthorizatedGuard ] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login'},*/
  {
    path: '',
    component: FullComponent,
    children: [
     {
        path: '',
        redirectTo: '/starter',
        pathMatch: 'full'
      },

      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'starter',
        loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
      },
      {path:'admin', component:AdminComponent,canActivate:[AutenticacionGuard]},
      {path:'indicadores', component:IndicadoresComponent,canActivate:[AutenticacionGuard]},
      {path:'indicadores/mostrar/:indicador_id', component:IndicadorShowComponent,canActivate:[AutenticacionGuard]},
      {path:'indicadores/crear', component:IndicadorCreateComponent,canActivate:[AutenticacionGuard]},
      {path:'indicadores/editar/:indicador_id', component:IndicadorCreateComponent,canActivate:[AutenticacionGuard]},
      {path:'geoportal', component:GeoportalComponent,canActivate:[AutenticacionGuard]},
      {path:'geoportal/zonas/crear', component:ZonaCreateComponent,canActivate:[AutenticacionGuard]},
      {path:'geoportal/zonas/editar/:zona_id', component:ZonaCreateComponent,canActivate:[AutenticacionGuard]},
      {path:'geoportal/capasBase', component:CapasBaseListComponent,canActivate:[AutenticacionGuard]},
      {path:'geoportal/capasBase/crear', component:CapaBaseCreateComponent,canActivate:[AutenticacionGuard]},
      {path:'geoportal/capasBase/editar/:capaBase_id', component:CapaBaseCreateComponent,canActivate:[AutenticacionGuard]},
      {path:'geoportal/mediciones/zona/:zonaId/parametro/:parametroId', component: MedicionesListComponent,canActivate:[AutenticacionGuard]},
      {path:'geoportal/mediciones/editar/:medicion_id', component:MedicionEditComponent,canActivate:[AutenticacionGuard]},
      {path:'parametros', component:ParametrosComponent,canActivate:[AutenticacionGuard]},
      {path:'parametros/mostrar/:parametro_id', component:ParametroShowComponent,canActivate:[AutenticacionGuard]},
      {path:'parametros/crear', component:ParametroCreateComponent,canActivate:[AutenticacionGuard]},
      {path:'parametros/editar/:parametro_id', component:ParametroCreateComponent,canActivate:[AutenticacionGuard]},
      {path:'proyectos', component:ProyectosComponent,canActivate:[AutenticacionGuard]},
      {path:'repositorio', component:RepositorioComponent, canActivate:[AutenticacionGuard]},
      {path: 'geoportal/crearCapa/crearEspacioDeTrabajo', component: CreateWorkspaceComponent,canActivate:[AutenticacionGuard]},
      {path: 'geoportal/crearCapa', component: CapaCreateComponent,canActivate:[AutenticacionGuard]},


    ]
  },

];

export const Routing = RouterModule.forRoot(AppRoutes);
