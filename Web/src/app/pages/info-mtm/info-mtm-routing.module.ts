import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoMtmComponent } from './info-mtm.component';

const routes: Routes = [
  {
    path: '',
    component: InfoMtmComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoMtmRoutingModule {}
