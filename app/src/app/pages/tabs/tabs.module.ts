import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

import { TranslateModule } from '@ngx-translate/core';

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
    ] 
})
export class TabsPageModule {}
