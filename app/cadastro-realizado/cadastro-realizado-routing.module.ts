import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroRealizadoPage } from './cadastro-realizado.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroRealizadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRealizadoPageRoutingModule {}
