import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// LIBRARIES IONIC
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';
import { ServiceWorkerModule } from '@angular/service-worker';

// UTILS
import { environment } from '@environment/environment';
import { provideTranslate } from '@providers/index';

// COMPONENTS
import { AppComponent } from './app.component';

// MODULES
import { ComponentModule } from '@modules/component.module';
import { PipeModule } from '@modules/pipes.module';
import { MapService } from './core/services';

@NgModule({ 
    declarations: [AppComponent],
    exports: [],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        AppRoutingModule,
        CommonModule,
        FormsModule,
        PipeModule,
        ComponentModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], 
    providers: [
        // MapService,
        StatusBar,
        InAppBrowser,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideTranslate,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {}

