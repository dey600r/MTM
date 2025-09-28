import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouteReuseStrategy } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// LIBRARIES IONIC
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

// UTILS
import { provideServiceWorker, provideTranslate } from '@providers/index';

// COMPONENTS
import { AppComponent } from './app.component';

// MODULES
import { ComponentModule } from '@modules/component.module';

@NgModule({ 
    declarations: [AppComponent],
    exports: [],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        AppRoutingModule,
        IonicModule.forRoot(),
        CommonModule,
        FormsModule,
        ComponentModule,
    ], 
    providers: [
        // provideZoneChangeDetection({ eventCoalescing: true }),
        // provideClientHydration(withEventReplay()), 
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideServiceWorker,
        provideTranslate,
        StatusBar,
        InAppBrowser,
    ] })
export class AppModule {}


