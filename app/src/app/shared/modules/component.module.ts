import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// LIBRARIES IONIC
import { IonicModule } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { IonCalendarModule } from '@heliomarpm/ion-calendar';
import { File } from '@awesome-cordova-plugins/file/ngx';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// UTILS
import { DataBaseService, CommonService } from '@services/index';

// MODULES
import { PipeModule } from '@modules/pipes.module';
import { SharedModule } from '@modules/shared.module';

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
import { SearchDashboardPopOverComponent } from '@modals/search-dashboard-popover/search-dashboard-popover.component';
import { ListDataToUpdateComponent } from '@modals/list-data-to-update/list-data-to-update.component';
import { InfoVehicleComponent } from '@modals/info-vehicle/info-vehicle.component';

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
        ListDataToUpdateComponent,
        InfoVehicleComponent
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
    ], imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        IonCalendarModule,
        NgxChartsModule,
        PipeModule,
        SharedModule,
        TranslateModule.forChild()
    ], providers: [
        File,
        ScreenOrientation,
        DataBaseService,
        CommonService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class ComponentModule { }
