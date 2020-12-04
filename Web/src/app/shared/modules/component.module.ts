import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconDocComponent } from '@components/icon-doc/icon-doc.component';
import { IconProjectComponent } from '@components/icon-project/icon-project.component';
import { IconCarouselComponent } from '@components/icon-carousel/icon-carousel.component';

import { PrimengModule } from './primeng.module';

import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    IconDocComponent,
    IconProjectComponent,
    IconCarouselComponent
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
    IconCarouselComponent
  ],
  providers: []
})
export class ComponentModule { }
