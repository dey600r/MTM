import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// LIBRARIES ANGULAR

// COMPONENT
import { ConfigurationPage } from './configuration.page';
import { SharedModule } from '@modules/shared.module';

@NgModule({ 
  declarations: [ConfigurationPage], 
  imports: [
    RouterModule.forChild([{ path: '', component: ConfigurationPage }]),
    SharedModule
  ], 
  providers: [] 
})
export class ConfigurationPageModule {}

