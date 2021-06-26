import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// LIBRARIES IONIC
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CalendarModule } from 'ion5-calendar';
import { File } from '@ionic-native/file/ngx';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// UTILS
import { DataBaseService, CommonService } from '@services/index';

// COMPONENTS
import { AddEditConfigurationComponent } from '@modals/add-edit-configuration/add-edit-configuration.component';
import { AddEditVehicleComponent } from '@modals/add-edit-vehicle/add-edit-vehicle.component';
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditMaintenanceElementComponent } from '@modals/add-edit-maintenance-element/add-edit-maintenance-element.component';
import { DashboardComponent } from '@modals/dashboard/dashboard.component';
import { InfoNotificationComponent } from '@modals/info-notification/info-notification.component';
import { SettingsComponent } from '@modals/settings/settings.component';
import { InfoCalendarComponent } from '@modals/info-calendar/info-calendar.component';
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';
import { ListDataToUpdateComponent } from '@modals/list-data-to-update/list-data-to-update.component';

@NgModule({
  declarations: [
    AddEditConfigurationComponent,
    AddEditVehicleComponent,
    AddEditOperationComponent,
    AddEditMaintenanceComponent,
    AddEditMaintenanceElementComponent,
    DashboardComponent,
    InfoNotificationComponent,
    SettingsComponent,
    InfoCalendarComponent,
    SearchDashboardPopOverComponent,
    ListDataToUpdateComponent
  ],
  entryComponents: [],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    CalendarModule,
    NgxChartsModule,
    TranslateModule.forChild()
  ],
  exports: [
    AddEditConfigurationComponent,
    AddEditVehicleComponent,
    AddEditOperationComponent,
    AddEditMaintenanceComponent,
    AddEditMaintenanceElementComponent,
    DashboardComponent,
    InfoNotificationComponent,
    SettingsComponent,
    InfoCalendarComponent,
    SearchDashboardPopOverComponent,
    ListDataToUpdateComponent
  ],
  providers: [
    File,
    SQLite,
    SQLitePorter,
    ScreenOrientation,
    DataBaseService,
    CommonService
  ]
})
export class ComponentModule { }
