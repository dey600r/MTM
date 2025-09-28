import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// COMPONENT
import { HomePage } from './home.page';
import { SharedModule } from '@modules/shared.module';

@NgModule({ 
  declarations: [HomePage], 
  imports: [
    RouterModule.forChild([{ path: '', component: HomePage }]),
    SharedModule
  ], 
  providers: [
  ] 
})
export class HomePageModule {}