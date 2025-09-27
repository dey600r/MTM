import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// LIBRARY ANGULAR
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslate } from '@providers/index';

// UTILS
import { PipeModule } from '@app/shared/modules/pipes.module';
import { SharedModule } from '@modules/shared.module';

// COMPONENTS
import { OperationPage } from './operation.page';

@NgModule({ 
  declarations: [OperationPage], 
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: OperationPage }]),
    TranslateModule.forChild(),
    PipeModule,
    SharedModule
  ], 
  providers: [ 
    provideTranslate,
    provideHttpClient(withInterceptorsFromDi())
  ] 
})
export class OperationPageModule {}
