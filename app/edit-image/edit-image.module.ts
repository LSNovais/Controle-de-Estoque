import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditImagePageRoutingModule } from './edit-image-routing.module';

import { EditImagePage } from './edit-image.page';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditImagePageRoutingModule,
    ImageCropperModule
  ],
  declarations: [EditImagePage]
})
export class EditImagePageModule {}
