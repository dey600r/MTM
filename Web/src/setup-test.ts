import { HomeComponent } from '@pages/home/home.component';
import { InfoMtmComponent } from '@pages/info-mtm/info-mtm.component';

import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { IconDocComponent } from '@components/icon-doc/icon-doc.component';
import { IconProjectComponent } from '@components/icon-project/icon-project.component';
import { IconCarouselComponent } from '@components/icon-carousel/icon-carousel.component';
import { IconTabComponent } from '@components/icon-tab/icon-tab.component';
import { IconListCardComponent } from '@components/icon-list-card/icon-list-card.component';
import { IconLinksComponent } from '@components/icon-links/icon-links.component';
import { IconHeaderComponent } from '@components/icon-header/icon-header.component';
import { BackgroundHeaderComponent } from '@components/background-header/background-header.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environments/environment';

export class SetupTest {
    static config = {
        imports: [
          HttpClientModule,
          RouterTestingModule,
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
          FooterComponent,
          IconDocComponent,
          IconProjectComponent,
          IconCarouselComponent,
          IconTabComponent,
          IconListCardComponent,
          IconLinksComponent,
          IconHeaderComponent,
          BackgroundHeaderComponent
        ],
        providers: [
          TranslateService
        ]
    };
}

// tslint:disable-next-line: typedef
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.pathTranslate, '.json');
}
