import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';

// UTILS
import { PipeModule } from '@app/shared/modules/pipes.module';
import { provideTranslate } from '@providers/index';

// COMPONENT
import { VehiclePage } from './vehicle.page';
import { SharedModule } from '@modules/shared.module';

@NgModule({ 
  declarations: [VehiclePage], 
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: VehiclePage }]),
    TranslateModule.forChild(),
    PipeModule,
    SharedModule
  ], 
  providers: [
    provideTranslate,
    provideHttpClient(withInterceptorsFromDi())
  ] 
})
export class VehiclePageModule {}
