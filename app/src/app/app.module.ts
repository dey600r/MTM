import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// LIBRARIES IONIC
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

// LIBRARIES ANGULAR
import { TranslateModule, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// UTILS
import { DataBaseService, CommonService } from '@services/index';
import { environment } from '../environments/environment';

// COMPONENTS
import { AppComponent } from './app.component';
import { AddEditMotoComponent } from '@modals/add-edit-moto/add-edit-moto.component';
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { SearchOperationPopOverComponent } from '@popovers/search-operation-popover/search-operation-popover.component';
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';
import { PipeModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    AppComponent,
    AddEditMotoComponent,
    AddEditOperationComponent,
    SearchOperationPopOverComponent,
    SearchDashboardPopOverComponent
  ],
  entryComponents: [
    AddEditMotoComponent,
    AddEditOperationComponent,
    SearchOperationPopOverComponent,
    SearchDashboardPopOverComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    CommonModule,
    FormsModule,
    PipeModule
  ],
  exports: [
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    SQLitePorter,
    DataBaseService,
    CommonService,
    TranslateStore,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.pathTranslate, '.json');
}
