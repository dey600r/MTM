import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// LIBRARIES IONIC
import { IonicModule } from '@ionic/angular';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// UTILS
import { PipeModule } from '@modules/pipes.module';

// COMPONENTS
import { AppInfoComponent } from '@components/info/app-info.component';
import { SkeletonComponent } from '@components/skeleton/skeleton.component';
import { BodySkeletonComponent } from '@components/skeleton/body/body-skeleton.component';
import { HeaderComponent } from '@components/header/header.component';
import { ComboChartComponent, ComboSeriesVerticalComponent } from '@components/combo-chart/index';

@NgModule({ 
    declarations: [
        AppInfoComponent,
        SkeletonComponent,
        BodySkeletonComponent,
        HeaderComponent,
        ComboChartComponent,
        ComboSeriesVerticalComponent
    ],
    exports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        PipeModule,
        NgxChartsModule,
        AppInfoComponent,
        SkeletonComponent,
        BodySkeletonComponent,
        HeaderComponent,
        ComboChartComponent,
        ComboSeriesVerticalComponent
    ], 
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        NgxChartsModule
    ],
    providers: [
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class SharedModule { }
