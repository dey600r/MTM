import { HomeComponent } from '@pages/home/home.component';
import { InfoMtmComponent } from '@pages/info-mtm/info-mtm.component';

import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '@environments/environment';

export class SetupTest {
    static config = {
        imports: [
          HttpClientModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
            }
          })],
        declarations: [
          HomeComponent,
          InfoMtmComponent,
          HeaderComponent,
          FooterComponent
        ]
    };
}

// tslint:disable-next-line: typedef
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.pathTranslate, '.json');
}
