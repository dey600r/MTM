import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslate } from '@providers/index';

// COMPONENT
import { HomePage } from './home.page';
import { SharedModule } from '@modules/shared.module';

@NgModule({ 
  declarations: [HomePage], 
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
    TranslateModule.forChild(),
    SharedModule
  ], 
  providers: [
    provideTranslate,
    provideHttpClient(withInterceptorsFromDi())
  ] 
})
export class HomePageModule {}