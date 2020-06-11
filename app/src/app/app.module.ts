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
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CalendarModule } from 'ion4-calendar';

// LIBRARIES ANGULAR
import { TranslateModule, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// UTILS
import { DataBaseService, CommonService } from '@services/index';
import { environment } from '@environment/environment';

// COMPONENTS
import { AppComponent } from './app.component';
import { AddEditConfigurationComponent } from '@modals/add-edit-configuration/add-edit-configuration.component';
import { AddEditVehicleComponent } from '@app/shared/modals/add-edit-vehicle/add-edit-vehicle.component';
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditMaintenanceElementComponent } from '@modals/add-edit-maintenance-element/add-edit-maintenance-element.component';
import { DashboardComponent } from '@app/shared/modals/dashboard/dashboard.component';
import { InfoNotificationComponent } from '@modals/info-notification/info-notification.component';
import { InfoCalendarComponent } from '@modals/info-calendar/info-calendar.component';
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';
import { PipeModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    AppComponent,
    AddEditConfigurationComponent,
    AddEditVehicleComponent,
    AddEditOperationComponent,
    AddEditMaintenanceComponent,
    AddEditMaintenanceElementComponent,
    DashboardComponent,
    InfoNotificationComponent,
    InfoCalendarComponent,
    SearchDashboardPopOverComponent
  ],
  entryComponents: [
    AddEditConfigurationComponent,
    AddEditVehicleComponent,
    AddEditOperationComponent,
    AddEditMaintenanceComponent,
    AddEditMaintenanceElementComponent,
    DashboardComponent,
    InfoNotificationComponent,
    InfoCalendarComponent,
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
    NgxChartsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    PipeModule,
    CalendarModule
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
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.pathTranslate, '.json');
}
