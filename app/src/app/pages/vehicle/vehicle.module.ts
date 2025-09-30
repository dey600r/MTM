import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// COMPONENT
import { VehiclePage } from './vehicle.page';
import { SharedModule } from '@modules/shared.module';

@NgModule({ 
  declarations: [VehiclePage], 
  imports: [
    RouterModule.forChild([{ path: '', component: VehiclePage }]),
    SharedModule
  ], 
  providers: [
  ] 
})
export class VehiclePageModule {}
