import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { InitialPage } from './initial.page';

import { InitialPageRoutingModule } from './initial-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitialPageRoutingModule
  ],
  declarations: [InitialPage]
})
export class InitialPageModule {}
