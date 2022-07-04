import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform} from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { Tab1Page } from '../tab1/tab1.page';
import { RouterOutlet, Router, ActivationStart } from '@angular/router';

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult  } from "firebase/auth";


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
const provider = new GoogleAuthProvider();

// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

//
//  Login Firebase
//  https://firebase.google.com/docs/auth/web/start?authuser=1
//

//
//  Login novos usuarios
//
const email:string = null;
const password:string = null;


// //
// //  Validar se o usuario esta ou nao conectado
// //
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

@Component({
  selector: 'app-initial',
  templateUrl: './initial.page.html',
  styleUrls: ['./initial.page.scss'],
})
export class InitialPage implements OnInit {
  routes : Routes;
  @ViewChild(RouterOutlet) outlet: RouterOutlet;
  @ViewChild('myNav') nav: NavController
  @ViewChild('slideInicial1')  slide1: IonSlides;
  public emailLogin:string;
  public senhaLogin:string;
  public nomeCadastro:string;
  public emailCadastro:string;
  public txEmailCadastroInvalido:string;
  public CNPJCadastro:string;
  public senhaCadastro:string;
  public confirmarSenhaCadastro:string;

  public validaNomeCadastro:boolean;
  public validaEmailCadastro:boolean;
  public validaCNPJCadastro:boolean;
  public validaSenhaCadastro:boolean;
  public validaConfirmSenhaCadastro:boolean;




  constructor(public navCtrl: NavController, public router: Router, private platform: Platform) {
    this.txEmailCadastroInvalido = "E-mail inválido!"

    const auth = getAuth();
    getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      alert("Logou com sucesso! " + user);
      // this.navCtrl.navigateRoot('./././tab1/tab1.page');

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      alert("Falha ao logar! -> errorCode: " + errorCode + " errorMessage: " + errorMessage);
    });
   }
   ngOnInit(): void {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart && e.snapshot.outlet === "administration")
        this.outlet.deactivate();
    });
  }
  continuaTelaLoginCadastro(){
    const slider = document.getElementById("cardSlider");
    const telaInicial = document.getElementById("cardLogin");

    slider.style.setProperty('visibility', 'hidden');
    telaInicial.style.setProperty('visibility', 'visible');
  }

  emailInvalido(invalido: boolean){
    const tbEmail = document.getElementById("tbCardEmail");
    const txEmailInvalido = document.getElementById("txCardEmailInvalido");

    if(invalido){
      tbEmail.style.borderColor = "red";
      txEmailInvalido.style.setProperty('visibility', 'visible');  
    }else{
      tbEmail.style.borderColor = "transparent";
      txEmailInvalido.style.setProperty('visibility', 'hidden');  
    }
  }

  senhaInvalido(invalido: boolean){
    const tbSenha = document.getElementById("tbCardSenha");
    const txSenhaInvalido = document.getElementById("txCardSenhaInvalida");

    if(invalido){
      tbSenha.style.borderColor = "red";
      txSenhaInvalido.style.setProperty('visibility', 'visible');
    }else{
      tbSenha.style.borderColor = "transparent";
      txSenhaInvalido.style.setProperty('visibility', 'hidden');
    }
  }
  avancarSlider(){
    this.slide1.slideNext();
  }

  abrirPopUpCadastro(){
    const cardCadastro = document.getElementById("cardCadastro");
    cardCadastro.style.setProperty('visibility', 'visible');
  }

  createUser(){

    if( (this.validaNomeCadastro) && (this.validaEmailCadastro) && (this.validaCNPJCadastro) && (this.validaSenhaCadastro) && (this.validaConfirmSenhaCadastro) ){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.emailCadastro, this.senhaCadastro)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Usuario criado! " + user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if( errorCode == "auth/email-already-in-use" ){
          this.txEmailCadastroInvalido = "E-mail em uso!"
          const txCardEmailCadastroInvalido = document.getElementById("txCardEmailCadastroInvalido");
          const tbCardEmailCadastro = document.getElementById("tbCardEmailCadastro");
          txCardEmailCadastroInvalido.style.setProperty('visibility', 'visible');
          txCardEmailCadastroInvalido.style.setProperty('opacity', '100%');
          tbCardEmailCadastro.style.setProperty('border-color', 'red');   
          this.validaEmailCadastro = false;
        }else{
          alert("Falha ao criar usuário! " + errorMessage + " Cod. Error: " + errorCode);
        }
      });
    }
  }

  loginUser(){
    if(this.emailLogin == null){
      this.emailInvalido(true);
    }else if(this.senhaLogin == null){
      this.emailInvalido(false);
      this.senhaInvalido(true);
    }else{

    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.emailLogin, this.senhaLogin)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Bem vindo! " + user.displayName);
      window.location.href = "/home/tabs/tab2";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(errorCode == "auth/missing-email" || errorCode == "auth/user-not-found" || errorCode == "auth/invalid-email"){
        this.emailInvalido(true);
        this.senhaInvalido(false);
      }else{
        alert("Falha ao realizar login! " + errorMessage + " Cod. Error: " + errorCode);
      }
    });
    }
  }

  loginWithGoogle(){
    const auth = getAuth();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    auth.languageCode = 'it';
    signInWithRedirect(auth, provider);
  }

  loginWithFacebook(){
    const auth = getAuth();
  }



  async cadastrarPessoaFisica(){
    // const cardCadastro = document.getElementById("cardCadastro");
    // cardCadastro.style.setProperty('visibility', 'hidden');
    const cardCadastroPessoaJuridica = document.getElementById("divCadastroPessoaJuridica");
    const txCardCadastroPessoaJuridica = document.getElementById("txCadastroPessoaFisica");
    const cardCadastroPessoafisica = document.getElementById("divCadastroPessoaFisica");

    const txCardNomeCadastro = document.getElementById("txCardNomeCadastro");
    const tbCardNomeCadastro = document.getElementById("tbCardNomeCadastro");
    const txCardEmailCadastro = document.getElementById("txCardEmailCadastro");
    const tbCardEmailCadastro = document.getElementById("tbCardEmailCadastro");
    const txCardCNPJCadastro = document.getElementById("txCardCNPJCadastro");
    const tbCardCNPJCadastro = document.getElementById("tbCardCNPJCadastro");
    const txCardSenhaCadastro = document.getElementById("txCardSenhaCadastro");
    const tbCardSenhaCadastro = document.getElementById("tbCardSenhaCadastro");
    const validacaoDigitos = document.getElementById("validacaoDigitos");
    const validacaoLetrasNumeros = document.getElementById("validacaoLetrasNumeros");
    const validacaoLetrasM = document.getElementById("validacaoLetrasM");
    const validacaoCaracEspeciais = document.getElementById("validacaoCaracEspeciais");
    const txValidacaoDigitos = document.getElementById("txValidacaoDigitos");
    const txValidacaoLetrasNumeros = document.getElementById("txValidacaoLetrasNumeros");
    const txValidacaoLetrasM = document.getElementById("txValidacaoLetrasM");
    const txValidacaoCaracEspeciais = document.getElementById("txValidacaoCaracEspeciais");
    const txCardConfirmarSenhaCadastro = document.getElementById("txCardConfirmarSenhaCadastro");
    const tbCardConfirmarSenhaCadastro = document.getElementById("tbCardConfirmarSenhaCadastro");
    const btCadastrarUsuario = document.getElementById("btCadastrarUsuario");
    const btFecharPopUpCadastro = document.getElementById("btFecharPopUpCadastro");


    cardCadastroPessoaJuridica.style.setProperty('z-index', '1');
    cardCadastroPessoafisica.style.setProperty('z-index', '2');
    cardCadastroPessoafisica.style.setProperty('transition-duration', '1s');
    cardCadastroPessoafisica.style.setProperty('height', '100%');
    txCardCadastroPessoaJuridica.style.setProperty('visibility', 'hidden');

    
    txCardNomeCadastro.style.setProperty('transition-delay', '0.1s');
    tbCardNomeCadastro.style.setProperty('transition-delay', '0.1s');
    txCardEmailCadastro.style.setProperty('transition-delay', '0.2s');
    tbCardEmailCadastro.style.setProperty('transition-delay', '0.2s');
    txCardCNPJCadastro.style.setProperty('transition-delay', '0.3s');
    tbCardCNPJCadastro.style.setProperty('transition-delay', '0.3s');
    txCardSenhaCadastro.style.setProperty('transition-delay', '0.4s');
    tbCardSenhaCadastro.style.setProperty('transition-delay', '0.4s');
    validacaoDigitos.style.setProperty('transition-delay', '0.5s');
    txValidacaoDigitos.style.setProperty('transition-delay', '0.5s');
    validacaoLetrasNumeros.style.setProperty('transition-delay', '0.5s');
    txValidacaoLetrasNumeros.style.setProperty('transition-delay', '0.5s');
    validacaoLetrasM.style.setProperty('transition-delay', '0.5s');
    txValidacaoLetrasM.style.setProperty('transition-delay', '0.5s');
    validacaoCaracEspeciais.style.setProperty('transition-delay', '0.5s');
    txValidacaoCaracEspeciais.style.setProperty('transition-delay', '0.5s');
    txCardConfirmarSenhaCadastro.style.setProperty('transition-delay', '0.6s');
    tbCardConfirmarSenhaCadastro.style.setProperty('transition-delay', '0.6s');
    btCadastrarUsuario.style.setProperty('transition-delay', '0.7s');
    btFecharPopUpCadastro.style.setProperty('transition-delay', '0.7s');


    txCardNomeCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardNomeCadastro.style.setProperty('transition-duration', '0.5s');
    txCardEmailCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardEmailCadastro.style.setProperty('transition-duration', '0.5s');
    txCardCNPJCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardCNPJCadastro.style.setProperty('transition-duration', '0.5s');
    txCardSenhaCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardSenhaCadastro.style.setProperty('transition-duration', '0.5s');
    validacaoDigitos.style.setProperty('transition-duration', '0.5s');
    txValidacaoDigitos.style.setProperty('transition-duration', '0.5s');
    validacaoLetrasNumeros.style.setProperty('transition-duration', '0.5s');
    txValidacaoLetrasNumeros.style.setProperty('transition-duration', '0.5s');
    validacaoLetrasM.style.setProperty('transition-duration', '0.5s');
    txValidacaoLetrasM.style.setProperty('transition-duration', '0.5s');
    validacaoCaracEspeciais.style.setProperty('transition-duration', '0.5s');
    txValidacaoCaracEspeciais.style.setProperty('transition-duration', '0.5s');
    txCardConfirmarSenhaCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardConfirmarSenhaCadastro.style.setProperty('transition-duration', '0.5s');
    btCadastrarUsuario.style.setProperty('transition-duration', '0.5s');
    btFecharPopUpCadastro.style.setProperty('transition-duration', '0.5s');

    txCardNomeCadastro.style.setProperty('visibility', 'visible');
    tbCardNomeCadastro.style.setProperty('visibility', 'visible');
    txCardEmailCadastro.style.setProperty('visibility', 'visible');
    tbCardEmailCadastro.style.setProperty('visibility', 'visible');
    txCardCNPJCadastro.style.setProperty('visibility', 'visible');
    tbCardCNPJCadastro.style.setProperty('visibility', 'visible');
    txCardSenhaCadastro.style.setProperty('visibility', 'visible');
    tbCardSenhaCadastro.style.setProperty('visibility', 'visible');
    validacaoDigitos.style.setProperty('visibility', 'visible');
    txValidacaoDigitos.style.setProperty('visibility', 'visible');
    validacaoLetrasNumeros.style.setProperty('visibility', 'visible');
    txValidacaoLetrasNumeros.style.setProperty('visibility', 'visible');
    validacaoLetrasM.style.setProperty('visibility', 'visible');
    txValidacaoLetrasM.style.setProperty('visibility', 'visible');
    validacaoCaracEspeciais.style.setProperty('visibility', 'visible');
    txValidacaoCaracEspeciais.style.setProperty('visibility', 'visible');
    txCardConfirmarSenhaCadastro.style.setProperty('visibility', 'visible');
    tbCardConfirmarSenhaCadastro.style.setProperty('visibility', 'visible');
    btCadastrarUsuario.style.setProperty('visibility', 'visible');
    btFecharPopUpCadastro.style.setProperty('visibility', 'visible');

    txCardNomeCadastro.style.setProperty('opacity', '100%');
    tbCardNomeCadastro.style.setProperty('opacity', '100%');
    txCardEmailCadastro.style.setProperty('opacity', '100%');
    tbCardEmailCadastro.style.setProperty('opacity', '100%');
    txCardCNPJCadastro.style.setProperty('opacity', '100%');
    tbCardCNPJCadastro.style.setProperty('opacity', '100%');
    txCardSenhaCadastro.style.setProperty('opacity', '100%');
    tbCardSenhaCadastro.style.setProperty('opacity', '100%');
    validacaoDigitos.style.setProperty('opacity', '100%');
    txValidacaoDigitos.style.setProperty('opacity', '100%');
    validacaoLetrasNumeros.style.setProperty('opacity', '100%');
    txValidacaoLetrasNumeros.style.setProperty('opacity', '100%');
    validacaoLetrasM.style.setProperty('opacity', '100%');
    txValidacaoLetrasM.style.setProperty('opacity', '100%');
    validacaoCaracEspeciais.style.setProperty('opacity', '100%');
    txValidacaoCaracEspeciais.style.setProperty('opacity', '100%');
    txCardConfirmarSenhaCadastro.style.setProperty('opacity', '100%');
    tbCardConfirmarSenhaCadastro.style.setProperty('opacity', '100%');
    btCadastrarUsuario.style.setProperty('opacity', '100%');
    btFecharPopUpCadastro.style.setProperty('opacity', '100%');

    await delay(1000);

    cardCadastroPessoafisica.style.setProperty('border-bottom-color', 'transparent');
    cardCadastroPessoafisica.style.setProperty('border-radius', '2.2%');

    validacaoDigitos.style.setProperty('transition-delay', '0s');
    txValidacaoDigitos.style.setProperty('transition-delay', '0s');
    validacaoLetrasNumeros.style.setProperty('transition-delay', '0s');
    txValidacaoLetrasNumeros.style.setProperty('transition-delay', '0s');
    validacaoLetrasM.style.setProperty('transition-delay', '0s');
    txValidacaoLetrasM.style.setProperty('transition-delay', '0s');
    validacaoCaracEspeciais.style.setProperty('transition-delay', '0s');
    txValidacaoCaracEspeciais.style.setProperty('transition-delay', '0s');
    btFecharPopUpCadastro.style.setProperty('transition-delay', '0s');

    validacaoDigitos.style.setProperty('transition-duration', '0s');
    txValidacaoDigitos.style.setProperty('transition-duration', '0s');
    validacaoLetrasNumeros.style.setProperty('transition-duration', '0s');
    txValidacaoLetrasNumeros.style.setProperty('transition-duration', '0s');
    validacaoLetrasM.style.setProperty('transition-duration', '0s');
    txValidacaoLetrasM.style.setProperty('transition-duration', '0s');
    validacaoCaracEspeciais.style.setProperty('transition-duration', '0s');
    txValidacaoCaracEspeciais.style.setProperty('transition-duration', '0s');
    btFecharPopUpCadastro.style.setProperty('transition-duration', '0s');
  }

  cadastrarPessoaJuridica(){
    const cardCadastro = document.getElementById("cardCadastro");
    cardCadastro.style.setProperty('visibility', 'hidden');
  }

  perdaFocoNomeCad(){
    const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    const txCardNomeCadastroInvalido = document.getElementById("txCardNomeCadastroInvalido");
    const tbCardNomeCadastro = document.getElementById("tbCardNomeCadastro");

    if( this.nomeCadastro == null || !regex.test(this.nomeCadastro) ){
      txCardNomeCadastroInvalido.style.setProperty('visibility', 'visible');
      txCardNomeCadastroInvalido.style.setProperty('opacity', '100%');
      tbCardNomeCadastro.style.setProperty('border-color', 'red');    
      this.validaNomeCadastro = false;
    }else{
      txCardNomeCadastroInvalido.style.setProperty('visibility', 'hidden');
      txCardNomeCadastroInvalido.style.setProperty('opacity', '0%');
      tbCardNomeCadastro.style.setProperty('border-color', 'transparent');    
      this.validaNomeCadastro = true;
    }
  }

  perdaFocoEmailCad(){
    const txCardEmailCadastroInvalido = document.getElementById("txCardEmailCadastroInvalido");
    const tbCardEmailCadastro = document.getElementById("tbCardEmailCadastro");

    if( this.emailCadastro == null || !this.emailCadastro.includes('@') || !this.emailCadastro.includes('.') ){
      txCardEmailCadastroInvalido.style.setProperty('visibility', 'visible');
      txCardEmailCadastroInvalido.style.setProperty('opacity', '100%');
      tbCardEmailCadastro.style.setProperty('border-color', 'red');   
      this.validaEmailCadastro = false;
    }else{
      txCardEmailCadastroInvalido.style.setProperty('visibility', 'hidden');
      txCardEmailCadastroInvalido.style.setProperty('opacity', '0%');
      tbCardEmailCadastro.style.setProperty('border-color', 'transparent');    
      this.validaEmailCadastro = true;
    }
  }

  perdaFocoCNPJCad(){
    const txCardCNPJCadastroInvalido = document.getElementById("txCardCNPJCadastroInvalido");
    const tbCardCNPJCadastro = document.getElementById("tbCardCNPJCadastro");

    if(this.CNPJCadastro.length !== 15){
      txCardCNPJCadastroInvalido.style.setProperty('visibility', 'visible');
      txCardCNPJCadastroInvalido.style.setProperty('opacity', '100%');
      tbCardCNPJCadastro.style.setProperty('border-color', 'red');   
      this.validaCNPJCadastro = false; 
    }else{
      txCardCNPJCadastroInvalido.style.setProperty('visibility', 'hidden');
      txCardCNPJCadastroInvalido.style.setProperty('opacity', '0%');
      tbCardCNPJCadastro.style.setProperty('border-color', 'transparent');    
      this.validaCNPJCadastro = true;
    }
  }

  keyPressCNPJ(){
    if(this.CNPJCadastro.length == 3){
      this.CNPJCadastro += '.';
    }else if(this.CNPJCadastro.length == 7){
      this.CNPJCadastro += '/0001-';
    }
  }

  keyPressSenhaCad(){
    const validacaoDigitos = document.getElementById("txValidacaoDigitos");
    const validacaoLetrasNumeros = document.getElementById("txValidacaoLetrasNumeros");
    const validacaoLetrasM = document.getElementById("txValidacaoLetrasM");
    const validacaoCaracEspeciais = document.getElementById("txValidacaoCaracEspeciais");

    const regexNumeros = /(?=.*[0-9])/;
    const regexLetrasMin = /(?=.*[a-z])/;
    const regexLetrasMai = /(?=.*[A-Z])/;
    const regexCaracEspeciais = /(?=.*[}{,.^?~=+\-_\/*\-+.\|@#$%&()])/;

    if( regexNumeros.test(this.senhaCadastro) ){
      validacaoLetrasNumeros.style.setProperty('color', 'green');    
      this.validaSenhaCadastro = true;
    }else{
      validacaoLetrasNumeros.style.setProperty('color', 'red');    
      this.validaSenhaCadastro = false;
    }

    if( regexLetrasMin.test(this.senhaCadastro) && regexLetrasMai.test(this.senhaCadastro) ){
      validacaoLetrasM.style.setProperty('color', 'green');    
      this.validaSenhaCadastro = true;
    }else{
      validacaoLetrasM.style.setProperty('color', 'red');    
      this.validaSenhaCadastro = false;
    }

    if( regexCaracEspeciais.test(this.senhaCadastro) ){
      validacaoCaracEspeciais.style.setProperty('color', 'green');    
      this.validaSenhaCadastro = true;
    }else{
      validacaoCaracEspeciais.style.setProperty('color', 'red');    
      this.validaSenhaCadastro = false;
    }

    if( this.senhaCadastro.length >= 8 ){
      validacaoDigitos.style.setProperty('color', 'green');    
      this.validaSenhaCadastro = true;
    }else{
      validacaoDigitos.style.setProperty('color', 'red');    
      this.validaSenhaCadastro = false;
    }

    if( this.senhaCadastro.length == 0 ){
      validacaoDigitos.style.setProperty('color', "#afafaf");    
      validacaoLetrasNumeros.style.setProperty('color', '#afafaf');    
      validacaoLetrasM.style.setProperty('color', '#afafaf');    
      validacaoCaracEspeciais.style.setProperty('color', '#afafaf');   
      this.validaSenhaCadastro = false; 
    }

  }

  perdaFocoSenhaCad(){
    const validacaoDigitos = document.getElementById("txValidacaoDigitos");
    const validacaoLetrasNumeros = document.getElementById("txValidacaoLetrasNumeros");
    const validacaoLetrasM = document.getElementById("txValidacaoLetrasM");
    const validacaoCaracEspeciais = document.getElementById("txValidacaoCaracEspeciais");

    if( this.senhaCadastro.length == 0 ){
      validacaoDigitos.style.setProperty('color', "#afafaf");    
      validacaoLetrasNumeros.style.setProperty('color', '#afafaf');    
      validacaoLetrasM.style.setProperty('color', '#afafaf');    
      validacaoCaracEspeciais.style.setProperty('color', '#afafaf');    
    }
  }

  perdaFocoConfirSenhaCad(){
    const txCardConfirmarSenhaCadastroInvalida = document.getElementById("txCardConfirmarSenhaCadastroInvalida");
    const tbCardConfirmarSenhaCadastro = document.getElementById("tbCardConfirmarSenhaCadastro");

    if(this.senhaCadastro !== this.confirmarSenhaCadastro){
      txCardConfirmarSenhaCadastroInvalida.style.setProperty('visibility', 'visible');
      txCardConfirmarSenhaCadastroInvalida.style.setProperty('opacity', '100%');
      tbCardConfirmarSenhaCadastro.style.setProperty('border-color', 'red');    
      this.validaConfirmSenhaCadastro = false;
    }else{
      txCardConfirmarSenhaCadastroInvalida.style.setProperty('visibility', 'hidden');
      txCardConfirmarSenhaCadastroInvalida.style.setProperty('opacity', '0%');
      tbCardConfirmarSenhaCadastro.style.setProperty('border-color', 'transparent');   
      this.validaConfirmSenhaCadastro = true; 
    }
  }

  fecharPopUpCadastro(){

    const txCardNomeCadastro = document.getElementById("txCardNomeCadastro");
    const tbCardNomeCadastro = document.getElementById("tbCardNomeCadastro");
    const txCardEmailCadastro = document.getElementById("txCardEmailCadastro");
    const tbCardEmailCadastro = document.getElementById("tbCardEmailCadastro");
    const txCardCNPJCadastro = document.getElementById("txCardCNPJCadastro");
    const tbCardCNPJCadastro = document.getElementById("tbCardCNPJCadastro");
    const txCardSenhaCadastro = document.getElementById("txCardSenhaCadastro");
    const tbCardSenhaCadastro = document.getElementById("tbCardSenhaCadastro");
    const validacaoDigitos = document.getElementById("validacaoDigitos");
    const validacaoLetrasNumeros = document.getElementById("validacaoLetrasNumeros");
    const validacaoLetrasM = document.getElementById("validacaoLetrasM");
    const validacaoCaracEspeciais = document.getElementById("validacaoCaracEspeciais");
    const txValidacaoDigitos = document.getElementById("txValidacaoDigitos");
    const txValidacaoLetrasNumeros = document.getElementById("txValidacaoLetrasNumeros");
    const txValidacaoLetrasM = document.getElementById("txValidacaoLetrasM");
    const txValidacaoCaracEspeciais = document.getElementById("txValidacaoCaracEspeciais");
    const txCardConfirmarSenhaCadastro = document.getElementById("txCardConfirmarSenhaCadastro");
    const tbCardConfirmarSenhaCadastro = document.getElementById("tbCardConfirmarSenhaCadastro");
    const btCadastrarUsuario = document.getElementById("btCadastrarUsuario");
    const cardCadastro = document.getElementById("cardCadastro");
    const subCardCadastro = document.getElementById("subCardCadastro");
    const btFecharPopUpCadastro = document.getElementById("btFecharPopUpCadastro");

    
    txCardNomeCadastro.style.setProperty('transition-delay', '0s');
    tbCardNomeCadastro.style.setProperty('transition-delay', '0s');
    txCardEmailCadastro.style.setProperty('transition-delay', '0s');
    tbCardEmailCadastro.style.setProperty('transition-delay', '0s');
    txCardCNPJCadastro.style.setProperty('transition-delay', '0s');
    tbCardCNPJCadastro.style.setProperty('transition-delay', '0s');
    txCardSenhaCadastro.style.setProperty('transition-delay', '0s');
    tbCardSenhaCadastro.style.setProperty('transition-delay', '0s');
    validacaoDigitos.style.setProperty('transition-delay', '0s');
    txValidacaoDigitos.style.setProperty('transition-delay', '0s');
    validacaoLetrasNumeros.style.setProperty('transition-delay', '0s');
    txValidacaoLetrasNumeros.style.setProperty('transition-delay', '0s');
    validacaoLetrasM.style.setProperty('transition-delay', '0s');
    txValidacaoLetrasM.style.setProperty('transition-delay', '0s');
    validacaoCaracEspeciais.style.setProperty('transition-delay', '0s');
    txValidacaoCaracEspeciais.style.setProperty('transition-delay', '0s');
    txCardConfirmarSenhaCadastro.style.setProperty('transition-delay', '0s');
    tbCardConfirmarSenhaCadastro.style.setProperty('transition-delay', '0s');
    cardCadastro.style.setProperty('transition-delay', '0s');
    subCardCadastro.style.setProperty('transition-delay', '0s');
    btCadastrarUsuario.style.setProperty('transition-delay', '0s');
    btFecharPopUpCadastro.style.setProperty('transition-delay', '0s');


    txCardNomeCadastro.style.setProperty('transition-duration', '0s');
    tbCardNomeCadastro.style.setProperty('transition-duration', '0s');
    txCardEmailCadastro.style.setProperty('transition-duration', '0s');
    tbCardEmailCadastro.style.setProperty('transition-duration', '0s');
    txCardCNPJCadastro.style.setProperty('transition-duration', '0s');
    tbCardCNPJCadastro.style.setProperty('transition-duration', '0s');
    txCardSenhaCadastro.style.setProperty('transition-duration', '0s');
    tbCardSenhaCadastro.style.setProperty('transition-duration', '0s');
    validacaoDigitos.style.setProperty('transition-duration', '0s');
    txValidacaoDigitos.style.setProperty('transition-duration', '0s');
    validacaoLetrasNumeros.style.setProperty('transition-duration', '0s');
    txValidacaoLetrasNumeros.style.setProperty('transition-duration', '0s');
    validacaoLetrasM.style.setProperty('transition-duration', '0s');
    txValidacaoLetrasM.style.setProperty('transition-duration', '0s');
    validacaoCaracEspeciais.style.setProperty('transition-duration', '0s');
    txValidacaoCaracEspeciais.style.setProperty('transition-duration', '0s');
    txCardConfirmarSenhaCadastro.style.setProperty('transition-duration', '0s');
    tbCardConfirmarSenhaCadastro.style.setProperty('transition-duration', '0s');
    cardCadastro.style.setProperty('transition-duration', '0s');
    subCardCadastro.style.setProperty('transition-duration', '0s');
    btCadastrarUsuario.style.setProperty('transition-duration', '0s');
    btFecharPopUpCadastro.style.setProperty('transition-duration', '0s');

    txCardNomeCadastro.style.setProperty('visibility', 'hidden');
    tbCardNomeCadastro.style.setProperty('visibility', 'hidden');
    txCardEmailCadastro.style.setProperty('visibility', 'hidden');
    tbCardEmailCadastro.style.setProperty('visibility', 'hidden');
    txCardCNPJCadastro.style.setProperty('visibility', 'hidden');
    tbCardCNPJCadastro.style.setProperty('visibility', 'hidden');
    txCardSenhaCadastro.style.setProperty('visibility', 'hidden');
    tbCardSenhaCadastro.style.setProperty('visibility', 'hidden');
    validacaoDigitos.style.setProperty('visibility', 'hidden');
    txValidacaoDigitos.style.setProperty('visibility', 'hidden');
    validacaoLetrasNumeros.style.setProperty('visibility', 'hidden');
    txValidacaoLetrasNumeros.style.setProperty('visibility', 'hidden');
    validacaoLetrasM.style.setProperty('visibility', 'hidden');
    txValidacaoLetrasM.style.setProperty('visibility', 'hidden');
    validacaoCaracEspeciais.style.setProperty('visibility', 'hidden');
    txValidacaoCaracEspeciais.style.setProperty('visibility', 'hidden');
    txCardConfirmarSenhaCadastro.style.setProperty('visibility', 'hidden');
    tbCardConfirmarSenhaCadastro.style.setProperty('visibility', 'hidden');
    btCadastrarUsuario.style.setProperty('visibility', 'hidden');
    cardCadastro.style.setProperty('visibility', 'hidden');
    subCardCadastro.style.setProperty('visibility', 'hidden');
    btFecharPopUpCadastro.style.setProperty('visibility', 'hidden');

    txCardNomeCadastro.style.setProperty('opacity', '0%');
    tbCardNomeCadastro.style.setProperty('opacity', '0%');
    txCardEmailCadastro.style.setProperty('opacity', '0%');
    tbCardEmailCadastro.style.setProperty('opacity', '0%');
    txCardCNPJCadastro.style.setProperty('opacity', '0%');
    tbCardCNPJCadastro.style.setProperty('opacity', '0%');
    txCardSenhaCadastro.style.setProperty('opacity', '0%');
    tbCardSenhaCadastro.style.setProperty('opacity', '0%');
    validacaoDigitos.style.setProperty('opacity', '0%');
    txValidacaoDigitos.style.setProperty('opacity', '0%');
    validacaoLetrasNumeros.style.setProperty('opacity', '0%');
    txValidacaoLetrasNumeros.style.setProperty('opacity', '0%');
    validacaoLetrasM.style.setProperty('opacity', '0%');
    txValidacaoLetrasM.style.setProperty('opacity', '0%');
    validacaoCaracEspeciais.style.setProperty('opacity', '0%');
    txValidacaoCaracEspeciais.style.setProperty('opacity', '0%');
    txCardConfirmarSenhaCadastro.style.setProperty('opacity', '0%');
    tbCardConfirmarSenhaCadastro.style.setProperty('opacity', '0%');
    cardCadastro.style.setProperty('opacity', '0%');
    subCardCadastro.style.setProperty('opacity', '0%');
    btCadastrarUsuario.style.setProperty('opacity', '0%');
    btFecharPopUpCadastro.style.setProperty('opacity', '0%');

  }

}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

