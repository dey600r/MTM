import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Constants } from './core/utils/constants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: Constants.ROUTE_HOME,
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: Constants.ROUTE_INFO_MTM,
    loadChildren: () => import('./pages/info-mtm/info-mtm.module').then(m => m.InfoMtmModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
