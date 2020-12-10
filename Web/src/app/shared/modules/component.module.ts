import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconDocComponent } from '@components/icon-doc/icon-doc.component';
import { IconProjectComponent } from '@components/icon-project/icon-project.component';
import { IconCarouselComponent } from '@components/icon-carousel/icon-carousel.component';
import { IconTabComponent } from '@components/icon-tab/icon-tab.component';
import { IconListCardComponent } from '@components/icon-list-card/icon-list-card.component';

import { PrimengModule } from './primeng.module';

import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    IconDocComponent,
    IconProjectComponent,
    IconCarouselComponent,
    IconTabComponent,
    IconListCardComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    HttpClientModule,
    TranslateModule.forChild()
  ],
  exports: [
    IconDocComponent,
    IconProjectComponent,
    IconCarouselComponent,
    IconTabComponent,
    IconListCardComponent
  ],
  providers: []
})
export class ComponentModule { }
