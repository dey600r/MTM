import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// LIBRARIES ANGULAR
import { TranslateModule, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// UTILS
import { environment } from '@environment/environment';

// COMPONENT
import { HomePage } from './home.page';
import { SharedModule } from '@modules/shared.module';

@NgModule({ declarations: [HomePage], imports: [IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: HomePage }]),
        TranslateModule.forChild({
          defaultLanguage: 'es',
          useDefaultLang: true,
          loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
          }
        }),
        SharedModule], providers: [TranslateStore, provideHttpClient(withInterceptorsFromDi())] })
export class HomePageModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.pathTranslate, '.json');
}
