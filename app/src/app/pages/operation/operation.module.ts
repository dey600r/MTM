import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// UTILS
import { SharedModule } from '@modules/shared.module';

// COMPONENTS
import { OperationPage } from './operation.page';

@NgModule({ 
  declarations: [OperationPage], 
  imports: [
    RouterModule.forChild([{ path: '', component: OperationPage }]),
    SharedModule
  ], 
  providers: [ 
  ] 
})
export class OperationPageModule {}
