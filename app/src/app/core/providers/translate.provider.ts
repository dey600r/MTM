import { importProvidersFrom } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { environment } from "@src/environments/environment";


export const provideTranslate = [
  importProvidersFrom([ TranslateModule.forRoot() ]),
  provideTranslateHttpLoader({ prefix: environment.pathTranslate, suffix: '.json' })
]