import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController} from '@ionic/angular';  
import { EditProdutosPage } from '../edit-produtos/edit-produtos.page';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

//firebase
import { doc, setDoc, getFirestore, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

import { ActivatedRoute, Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';



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
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  providers: [ BarcodeScanner ],
  
  styleUrls: ['tab3.page.scss']
})

//Declaração da classe
export class Tab3Page{
 //Produto
 public codBarras:number = 0;
 public nomeProduto:string;
 public codProduto:string = null;
 public selectProduto = [] ;
 public indiceProdutoSelect:number = 0;
 public jsonBDProduto;


 //Usuario
 public codEmpresa:string = null;
 public emailUsuario:string = null;
 public codUnico:string = null;
 public selectPerfil = [];

 scannedData: any;
 encodedData: '';
 encodeData: any;
 inputData: any;


 constructor(public modalCtrl: ModalController, private alertController: AlertController, private barcodeScanner: BarcodeScanner, public router: Router) { 
  const auth = getAuth();

  const user = auth.currentUser;
  if (user !== null) {
    this.emailUsuario = user.email;
    this.consultaPerfil();
  }

  this.scanner();
 }

 async consultaPerfil(){
  const q = query(collection(db, "usuarios"), where("email", "==", this.emailUsuario));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    this.selectPerfil[0] = doc.data();
  });

  this.codEmpresa = (this.selectPerfil[0].cod_empresa) ? this.selectPerfil[0].cod_empresa : null;
 }

 ngOnInit() {
 
 }

 fecharPagina(){
   this.modalCtrl.dismiss();
 }


 async consultarProduto(){
  this.indiceProdutoSelect = 0;
  this.selectProduto = [];

  if( this.codProduto !== null ){

    if( this.codEmpresa !== null ){
      this.codUnico = this.codEmpresa;
    }else{
      this.codUnico = this.emailUsuario;
    }

    const q = query(collection(db, "produtos"), where("cod_unico", "==", this.codUnico), where("sts_ativo", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.selectProduto.push(doc.data());
    });      

    while( this.indiceProdutoSelect <= this.selectProduto.length ){

      if( this.selectProduto[this.indiceProdutoSelect] == null ){
        if( this.indiceProdutoSelect == this.selectProduto.length ){
          this.cadastrarNovoProduto();
        }
      }

      if( this.selectProduto[this.indiceProdutoSelect].cod_barras == this.codProduto
          || this.selectProduto[this.indiceProdutoSelect].nom_produto == this.codProduto){

        this.jsonBDProduto = {
           cod_barras:this.selectProduto[this.indiceProdutoSelect].cod_barras,
           nom_produto:this.selectProduto[this.indiceProdutoSelect].nom_produto,
           cod_unico:this.selectProduto[this.indiceProdutoSelect].cod_unico,
           categoria:this.selectProduto[this.indiceProdutoSelect].categoria,
           peso:this.selectProduto[this.indiceProdutoSelect].peso,
           tipo_peso:this.selectProduto[this.indiceProdutoSelect].tipo_peso,
           quantidade_produto:this.selectProduto[this.indiceProdutoSelect].quantidade_produto,
           preco:this.selectProduto[this.indiceProdutoSelect].preco,
           sts_ativo:this.selectProduto[this.indiceProdutoSelect].sts_ativo,
           dataCadastro:this.selectProduto[this.indiceProdutoSelect].dt_cadastro,
           usuario_cadastro:this.selectProduto[this.indiceProdutoSelect].usuario_cadastro,
           sts_novo_produto:false
         }

         this.modalCtrl.dismiss();
         this.router.navigate(['/edit-produtos', this.jsonBDProduto]);
         return;
      }
    }

  }else{
    this.cadastrarNovoProduto();
  }
 }

 scanner(){
  this.barcodeScanner.scan().then(barcodeData => {
    console.log('Barcode data', barcodeData);
   }).catch(err => {
       console.log('Error', err);
   });
 }


 async cadastrarNovoProduto(){
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
            this.jsonBDProduto = {
              cod_barras: null,
              nom_produto: this.nomeProduto,
              cod_unico: null,
              categoria: null,
              peso: null,
              tipo_peso: null,
              quantidade_produto: null,
              preco: null,
              sts_ativo: null,
              dataCadastro: null,
              usuario_cadastro:this.emailUsuario,
              sts_novo_produto:true
            }
            this.modalCtrl.dismiss();
            this.router.navigate(['/edit-produtos', this.jsonBDProduto]);
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