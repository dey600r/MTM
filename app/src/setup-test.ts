import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule, IonicRouteStrategy, AngularDelegate } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

// EXTERNAL LIBRARIES
import {
  TranslateModule, TranslateLoader, TranslateService, TranslateStore, TranslateCompiler,
  TranslateParser, MissingTranslationHandler, USE_DEFAULT_LANG, USE_STORE
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalController, PopoverController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';

// TESTING LIBRARIES
import { RouterTestingModule } from '@angular/router/testing';

// CONFIG
import { environment } from '@environment/environment';

// COMPONENTS
import { AppComponent } from '@app/app.component';
import { HeaderSkeletonComponent } from '@components/header-skeleton/header-skeleton.component';
import { AppInfoComponent } from '@components/info/app-info.component';
import { ConfigurationPage } from '@pages/configuration/configuration.page';
import { HomePage } from '@pages/home/home.page';
import { OperationPage } from '@pages/operation/operation.page';
import { VehiclePage } from '@pages/vehicle/vehicle.page';
import { TabsPage } from '@shared/tabs/tabs.page';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MyMissingTranslationHandler implements MissingTranslationHandler {
  public handle(key) {
    return `custom missing translation for ${key}`;
  }
}

@Injectable()
export class TranslationHome implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return new BehaviorSubject([lang]);
  }
}

export class SetupTest {
    static config = {
        imports: [
          BrowserModule,
          BrowserAnimationsModule,
          HttpClientTestingModule,
          RouterTestingModule,
          CommonModule,
          FormsModule,
          IonicModule.forRoot(),
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslationHome,
              useFactory: (createTranslateLoader),
              deps: [HttpClient],
              multi: false
            },
            useDefaultLang: false
          })
        ],
        declarations: [
          AppComponent,
          HeaderSkeletonComponent,
          AppInfoComponent,
          ConfigurationPage,
          HomePage,
          OperationPage,
          VehiclePage,
          TabsPage
        ],
        providers: [
          TranslateService,
          SQLitePorter,
          SQLite,
          HttpClient,
          HttpHandler,
          TranslateStore,
          TranslateLoader,
          TranslateCompiler,
          TranslateParser,
          { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
          { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
          { provide: USE_DEFAULT_LANG, useClass: TranslateLoader },
          { provide: USE_STORE, useClass: TranslateLoader },
          ModalController,
          AngularDelegate,
          PopoverController,
          File
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    };
}

// tslint:disable-next-line: typedef
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.pathTranslate, '.json');
}
