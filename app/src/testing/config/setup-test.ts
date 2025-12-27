import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// EXTERNAL LIBRARIES
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// TESTING LIBRARIES
import { RouterTestingModule } from '@angular/router/testing';

// CONFIG
import { environment } from '@environment/environment';
import { SpyMockConfig } from './spy.spec';
import { routes } from '@src/app/app-routing.module';

// COMPONENTS
import { AppComponent } from '@app/app.component';
import { SkeletonComponent } from '@components/skeleton/skeleton.component';
import { HeaderSkeletonComponent } from '@components/skeleton/header/header-skeleton.component';
import { BodySkeletonComponent } from '@components/skeleton/body/body-skeleton.component';
import { AppInfoComponent } from '@components/info/app-info.component';
import { HeaderComponent } from '@components/header/header.component';
import { ConfigurationPage } from '@pages/configuration/configuration.page';
import { HomePage } from '@pages/home/home.page';
import { OperationPage } from '@pages/operation/operation.page';
import { VehiclePage } from '@pages/vehicle/vehicle.page';
import { TabsPage } from '@pages/tabs/tabs.page';
import { DateFormatCalendarPipe } from '@pipes/date-format-calendar.pipe';
import { SearchDashboardPopOverComponent } from '@modals/search-dashboard-popover/search-dashboard-popover.component';
import { AddEditConfigurationComponent } from '@modals/add-edit-configuration/add-edit-configuration.component';
import { AddEditVehicleComponent } from '@modals/add-edit-vehicle/add-edit-vehicle.component';
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditMaintenanceElementComponent } from '@modals/add-edit-maintenance-element/add-edit-maintenance-element.component';
import { DashboardComponent } from '@modals/dashboard/dashboard.component';
import { InfoNotificationComponent } from '@modals/info-notification/info-notification.component';
import { InfoVehicleComponent } from '@modals/info-vehicle/info-vehicle.component';
import { SettingsComponent } from '@modals/settings/settings.component';
import { InfoCalendarComponent } from '@modals/info-calendar/info-calendar.component';
import { ListDataToUpdateComponent } from '@modals/list-data-to-update/list-data-to-update.component';

export class SetupTest {
  static readonly config = {
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      RouterTestingModule.withRoutes(routes),
      CommonModule,
      FormsModule,
      IonicModule.forRoot(),
      TranslateModule.forRoot()
    ],
    declarations: [
      AppComponent,
      SkeletonComponent,
      HeaderSkeletonComponent,
      BodySkeletonComponent,
      AppInfoComponent,
      HeaderComponent,
      ConfigurationPage,
      HomePage,
      OperationPage,
      VehiclePage,
      TabsPage,
      DateFormatCalendarPipe,
      AddEditConfigurationComponent,
      AddEditVehicleComponent,
      AddEditOperationComponent,
      AddEditMaintenanceComponent,
      AddEditMaintenanceElementComponent,
      DashboardComponent,
      InfoNotificationComponent,
      SettingsComponent,
      InfoCalendarComponent,
      InfoVehicleComponent,
      SearchDashboardPopOverComponent,
      ListDataToUpdateComponent
    ],
    providers: SpyMockConfig.Providers,
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
  } ;
}


