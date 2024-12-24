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
import { HeaderModalComponent } from '@components/header-modal/header-modal.component';

@NgModule({ 
    declarations: [
        AppInfoComponent,
        HeaderSkeletonComponent,
        HeaderModalComponent
    ],
    exports: [
        AppInfoComponent,
        HeaderSkeletonComponent,
        HeaderModalComponent
    ], imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule.forChild()], 
        providers: [provideHttpClient(withInterceptorsFromDi())

    ]})
export class SharedModule { }
