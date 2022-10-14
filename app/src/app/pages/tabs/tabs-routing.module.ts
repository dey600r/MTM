import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'homeTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'vehicleTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../vehicle/vehicle.module').then(m => m.VehiclePageModule)
          }
        ]
      },
      {
        path: 'operationTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../operation/operation.module').then(m => m.OperationPageModule)
          }
        ]
      },
      {
        path: 'configurationTab',
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
        redirectTo: '/tabs/homeTab',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/homeTab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
