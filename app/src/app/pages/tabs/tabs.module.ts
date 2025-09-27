import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslate } from '@providers/index';

@NgModule({
    declarations: [TabsPage], 
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        TranslateModule.forChild()
    ], 
    providers: [ 
        provideTranslate,
        provideHttpClient(withInterceptorsFromDi())
    ] 
})
export class TabsPageModule {}
