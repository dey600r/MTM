import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  exports: [
    MatTabsModule,
    MatGridListModule
  ]
})
export class MaterialModule { }
