import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { TabsPage } from '../tabs/tabs.page';
import { IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

//Declaração da classe
export class Tab1Page {

  // constructor(
  //   public navCtrl: NavController,
  //   public navParams: NavParams){
  // }

  
  // public nome_usuario:string = "Lucas";
  // public sobrenome_usuario:string = "da Silva Novais";
  // public usuario:string = "Lnovais";


  //Criar function
  // public funcaoTesteSomaTexto(nome:string, sobrenome:string): void{
  //   alert(nome + sobrenome);
  // }

  //Executa esse método quando a página termina de carregar.
  // ionViewOidLoad(){
  //   this.funcaoTesteSomaTexto(this.nome_usuario, this.sobrenome_usuario);
  // }

  //Função utilizada para alterar a página
  //closePopUpInitial(){
  //  this.navCtrl.navigateForward(TabsPage)
  //}

  @ViewChild('mySlider1')  slide1: IonSlides;
  @ViewChild('mySlider2')  slide2: IonSlides;
  @ViewChild('mySlider3')  slide3: IonSlides;
  public x = 1;


  swipeNext(i:number){
    if(i == 1){
      this.slide1.slideNext();
    }else if(i == 2){
      this.slide2.slideNext();
    }else if(i == 3){
      this.slide3.slideNext();
    }
  }

  fecharPopUp(){
    const div = document.getElementById("divPopUpInicialSlide");

    if (div != null) {
      div.style.setProperty('visibility', 'hidden');
    }
  
    setTimeout(() => {
      this.swipeNext(this.x);
    }, 3000);
    this.x = this.x + 1;
    setTimeout(() => {
      this.swipeNext(this.x);
    }, 3000);
    this.x = this.x + 1;
    setTimeout(() => {
      this.swipeNext(this.x);
    }, 3000);
    this.x = this.x + 1;

    // do{
    //   setTimeout(() => {
    //     if((this.x/1) == 1){
    //         this.swipeNext(this.x);
    //     }else if((this.x/2) == 2){
    //         this.swipeNext(this.x);
    //     }else if((this.x/3) == 3){
    //         this.swipeNext(this.x);
    //     }else{
    //       this.x = 1;
    //     }
    //     this.x++;
    //   }, 3000);
    // }while(this.x <= 3)

  }





}


