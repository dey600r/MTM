import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AddEditMotoComponent } from '@modals/add-edit-moto/add-edit-moto.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  declarations: [AddEditMotoComponent],
  entryComponents: [AddEditMotoComponent]
})
export class SharedModule {}
