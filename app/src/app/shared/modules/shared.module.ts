import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// LIBRARIES IONIC
import { IonicModule } from '@ionic/angular';

// LIBRARIES ANGULAR
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

// COMPONENTS
import { AppInfoComponent } from '@components/info/app-info.component';
import { HeaderSkeletonComponent } from '@components/header-skeleton/header-skeleton.component';

@NgModule({
    declarations: [
        AppInfoComponent,
        HeaderSkeletonComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forChild()
    ],
    exports: [
        AppInfoComponent,
        HeaderSkeletonComponent
    ],
    providers: []
})
export class SharedModule { }
