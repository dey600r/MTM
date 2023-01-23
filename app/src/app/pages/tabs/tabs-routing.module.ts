import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'vehicle',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../vehicle/vehicle.module').then(m => m.VehiclePageModule)
          }
        ]
      },
      {
        path: 'operation',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../operation/operation.module').then(m => m.OperationPageModule)
          }
        ]
      },
      {
        path: 'configuration',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../configuration/configuration.module').then(m => m.ConfigurationPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
