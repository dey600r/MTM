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
import { HeaderSkeletonComponent } from '@components/header-skeleton/header-skeleton.component';
import { HeaderComponent } from '@src/app/shared/components/header/header.component';

@NgModule({ 
    declarations: [
        AppInfoComponent,
        HeaderSkeletonComponent,
        HeaderComponent
    ],
    exports: [
        AppInfoComponent,
        HeaderSkeletonComponent,
        HeaderComponent
    ], imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule.forChild()], 
        providers: [provideHttpClient(withInterceptorsFromDi())

    ]})
export class SharedModule { }
