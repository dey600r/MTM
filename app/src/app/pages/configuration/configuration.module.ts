import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouterModule, RouteReuseStrategy, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// LIBRARIES ANGULAR
import { TranslateModule, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// UTILS
import { environment } from '@environment/environment';

// COMPONENT
import { ConfigurationPage } from './configuration.page';

@NgModule({
  declarations: [ConfigurationPage],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ConfigurationPage}]),
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [TranslateStore],
})
export class ConfigurationPageModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.pathTranslate, '.json');
}
