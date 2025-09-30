import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// LIBRARIES IONIC
import { IonicModule } from '@ionic/angular';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';

// UTILS
import { PipeModule } from '@modules/pipes.module';

// COMPONENTS
import { AppInfoComponent } from '@components/info/app-info.component';
import { SkeletonComponent } from '@components/skeleton/skeleton.component';
import { BodySkeletonComponent } from '@components/skeleton/body/body-skeleton.component';
import { HeaderComponent } from '@components/header/header.component';

@NgModule({ 
    declarations: [
        AppInfoComponent,
        SkeletonComponent,
        BodySkeletonComponent,
        HeaderComponent
    ],
    exports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        PipeModule,
        AppInfoComponent,
        SkeletonComponent,
        BodySkeletonComponent,
        HeaderComponent
    ], 
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule
    ],
    providers: [
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class SharedModule { }
