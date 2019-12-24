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
              import('../../pages/home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'motoTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../../pages/moto/moto.module').then(m => m.MotoPageModule)
          }
        ]
      },
      {
        path: 'operationTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../../pages/operation/operation.module').then(m => m.OperationPageModule)
          }
        ]
      },
      {
        path: 'configurationTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../../pages/configuration/configuration.module').then(m => m.ConfigurationPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/homeTab',
        pathMatch: 'full'
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
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
