import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastro-realizado',
  templateUrl: './cadastro-realizado.page.html',
  styleUrls: ['./cadastro-realizado.page.scss'],
})
export class CadastroRealizadoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  voltarLogin(){
    window.location.href = "/login?value=1";
  }
}
