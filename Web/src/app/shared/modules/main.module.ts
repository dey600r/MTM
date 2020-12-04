import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { PrimengModule } from './primeng.module';

import { HttpClientModule } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    HttpClientModule,
    TranslateModule.forChild()
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  providers: []
})
export class MainModule { }
