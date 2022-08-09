import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditProdutosPage } from '../edit-produtos/edit-produtos.page';

//firebase
import { doc, setDoc, getFirestore, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

import { ActivatedRoute, Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

const firebaseConfig = {
  apiKey: "AIzaSyBdP5R92n_M3OdyukinRkd9Wwomx5_gHNc",
  authDomain: "controle-de-estoque-be864.firebaseapp.com",
  projectId: "controle-de-estoque-be864",
  storageBucket: "controle-de-estoque-be864.appspot.com",
  messagingSenderId: "757713708408",
  appId: "1:757713708408:web:9ccf30aae30c0b63a1148d",
  measurementId: "G-KB25WTR1PR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
 
@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
})
export class ProdutosPage implements OnInit {
  //Produto
  public nomeProduto:string;
  public codProduto:string;
  public selectProduto = [];

  //Usuario
  public codEmpresa:string = null;
  public emailUsuario:string = null;
  public codUnico:string = null;



  constructor(public modalCtrl: ModalController, private alertController: AlertController) { }

  ngOnInit() {
  }

  fecharPagina(){
    this.modalCtrl.dismiss();
  }

  async consultarProduto(){

    if( this.codEmpresa !== null ){
      this.codUnico = this.codEmpresa;
    }else{
      this.codUnico = this.emailUsuario;
    }

    const q = query(collection(db, "produtos"), where("cod_unico", "==", this.codUnico), where("sts_ativo", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.selectProduto[0] = doc.data();
    });

    if( this.selectProduto[0] !== null ){
        this.modalCtrl.dismiss();
        const modalPageProduto = await this.modalCtrl.create({
          component: EditProdutosPage
        });
        return await modalPageProduto.present();
    }else{
      const alertt = await this.alertController.create({
        header: 'Produto não encontrado. Cadastre um agora!',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              //Ação ao clicar em "Cancelar"
            }
          }, 
          {
              text: 'Continuar',
              handler: (alertData) => { //takes the data 
                this.nomeProduto = alertData.nomeProduto;

              }
          }
        ],
        inputs: [
          {
            name: 'nomeProduto',
            placeholder: 'Nome do produto.',
            type: 'text'
          }
        ]
      });
  
      await alertt.present();
    }

  }

}
