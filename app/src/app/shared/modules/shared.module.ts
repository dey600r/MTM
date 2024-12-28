import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// LIBRARIES IONIC
import { IonicModule } from '@ionic/angular';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// COMPONENTS
import { AppInfoComponent } from '@components/info/app-info.component';
import { SkeletonComponent } from '@src/app/shared/components/skeleton/skeleton.component';
import { BodySkeletonComponent } from '@src/app/shared/components/skeleton/body/body-skeleton.component';
import { HeaderComponent } from '@src/app/shared/components/header/header.component';

@NgModule({ 
    declarations: [
        AppInfoComponent,
        SkeletonComponent,
        BodySkeletonComponent,
        HeaderComponent
    ],
    exports: [
        AppInfoComponent,
        SkeletonComponent,
        BodySkeletonComponent,
        HeaderComponent
    ], imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule.forChild()], 
        providers: [provideHttpClient(withInterceptorsFromDi())

    ]})
export class SharedModule { }
