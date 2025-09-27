import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { environment } from "@src/environments/environment";


export const provideTranslate = provideTranslateHttpLoader({
      prefix: environment.pathTranslate, // p. ej. './assets/i18n/'
      suffix: '.json'
    })