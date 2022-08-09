import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('slideInicial1')  slide1: IonSlides;

  constructor(public router: Router) { }

  ngOnInit() {
  }

  avancarSlider(){
    this.slide1.slideNext();
  }

  continuaTelaLoginCadastro(){
    this.router.navigate(['login']);
  }
  
}
