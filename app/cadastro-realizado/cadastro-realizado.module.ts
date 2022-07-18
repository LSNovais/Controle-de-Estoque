import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroRealizadoPageRoutingModule } from './cadastro-realizado-routing.module';

import { CadastroRealizadoPage } from './cadastro-realizado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroRealizadoPageRoutingModule
  ],
  declarations: [CadastroRealizadoPage]
})
export class CadastroRealizadoPageModule {}
