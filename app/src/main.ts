import { enableProdMode, Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err)).finally(() => {});

// setTimeout(() => {
//     document.getElementById('custom-overlay').style.display = 'none';
//   }, 10000);

// const onDeviceReady = () => {
//   platformBrowserDynamic().bootstrapModule(AppModule);
// };

// document.addEventListener('deviceready', onDeviceReady, false);
