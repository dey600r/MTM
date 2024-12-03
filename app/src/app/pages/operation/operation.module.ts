import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// LIBRARY ANGULAR
import { TranslateModule, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// UTILS
import { environment } from '@environment/environment';
import { PipeModule } from '@app/shared/modules/pipes.module';
import { SharedModule } from '@modules/shared.module';

// COMPONENTS
import { OperationPage } from './operation.page';

@NgModule({ declarations: [OperationPage], imports: [IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: OperationPage }]),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        PipeModule,
        SharedModule], providers: [TranslateStore, provideHttpClient(withInterceptorsFromDi())] })
export class OperationPageModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.pathTranslate, '.json');
}
