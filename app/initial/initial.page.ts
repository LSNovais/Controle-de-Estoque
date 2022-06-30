import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController} from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';


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

// const routes: Routes = [
//   { path: 'homepage', loadChildren: '../tab1/tab1.page' };
// ]

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
export class InitialPage {
  @ViewChild('slideInicial1')  slide1: IonSlides;
  public emailLogin:string;
  public senhaLogin:string;


  constructor(public navCtrl: NavController) {
    const auth = getAuth();
    getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      alert("Logou com sucesso! " + user);
      // this.navCtrl.navigateRoot('././tab1/tab1.page');

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

  createUser(){
    const cardCadastro = document.getElementById("cardCadastro");
    cardCadastro.style.setProperty('visibility', 'visible');


    // const auth = getAuth();
    // createUserWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //   const user = userCredential.user;
    //   alert("Usuario criado! " + user);
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   alert("Falha ao criar usuário! " + errorMessage + " Cod. Error: " + errorCode);
    // });
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
        alert("Bem vindo! " + user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Falha ao realizar login! " + errorMessage + " Cod. Error: " + errorCode);
        if(errorCode == "auth/missing-email" || errorCode == "auth/user-not-found"){
          this.emailInvalido(true);
        }else{
          this.emailInvalido(false);
          this.senhaInvalido(true);
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



  cadastrarPessoaFisica(){
    // const cardCadastro = document.getElementById("cardCadastro");
    // cardCadastro.style.setProperty('visibility', 'hidden');
    const cardCadastroPessoaJuridica = document.getElementById("divCadastroPessoaJuridica");
    const txCardCadastroPessoaJuridica = document.getElementById("txCadastroPessoaFisica");
    const cardCadastroPessoafisica = document.getElementById("divCadastroPessoaFisica");

    const txCardNomeCadastro = document.getElementById("txCardNomeCadastro");
    const tbCardNomeCadastro = document.getElementById("tbCardNomeCadastro");
    const txCardNomeCadastroInvalido = document.getElementById("txCardNomeCadastroInvalido");
    const txCardEmailCadastro = document.getElementById("txCardEmailCadastro");
    const tbCardEmailCadastro = document.getElementById("tbCardEmailCadastro");
    const txCardEmailCadastroInvalido = document.getElementById("txCardEmailCadastroInvalido");
    const txCardCNPJCadastro = document.getElementById("txCardCNPJCadastro");
    const tbCardCNPJCadastro = document.getElementById("tbCardCNPJCadastro");
    const txCardCNPJCadastroInvalido = document.getElementById("txCardCNPJCadastroInvalido");
    const txCardSenhaCadastro = document.getElementById("txCardSenhaCadastro");
    const tbCardSenhaCadastro = document.getElementById("tbCardSenhaCadastro");
    const txCardSenhaCadastroInvalida = document.getElementById("txCardSenhaCadastroInvalida");
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
    const txCardConfirmarSenhaCadastroInvalida = document.getElementById("txCardConfirmarSenhaCadastroInvalida");


    cardCadastroPessoaJuridica.style.setProperty('z-index', '1');
    cardCadastroPessoafisica.style.setProperty('z-index', '2');
    cardCadastroPessoafisica.style.setProperty('transition-duration', '1s');
    cardCadastroPessoafisica.style.setProperty('height', '100%');
    txCardCadastroPessoaJuridica.style.setProperty('visibility', 'hidden');


    
    txCardNomeCadastro.style.setProperty('transition-delay', '0.1s');
    tbCardNomeCadastro.style.setProperty('transition-delay', '0.1s');
    txCardNomeCadastroInvalido.style.setProperty('transition-delay', '0.1s');
    txCardEmailCadastro.style.setProperty('transition-delay', '0.5s');
    tbCardEmailCadastro.style.setProperty('transition-delay', '0.5s');
    txCardEmailCadastroInvalido.style.setProperty('transition-delay', '0.5s');
    txCardCNPJCadastro.style.setProperty('transition-delay', '1s');
    tbCardCNPJCadastro.style.setProperty('transition-delay', '1s');
    txCardCNPJCadastroInvalido.style.setProperty('transition-delay', '1s');
    txCardSenhaCadastro.style.setProperty('transition-delay', '1.5s');
    tbCardSenhaCadastro.style.setProperty('transition-delay', '1.5s');
    txCardSenhaCadastroInvalida.style.setProperty('transition-delay', '1.5s');
    validacaoDigitos.style.setProperty('transition-delay', '2s');
    txValidacaoDigitos.style.setProperty('transition-delay', '2s');
    validacaoLetrasNumeros.style.setProperty('transition-delay', '2.2s');
    txValidacaoLetrasNumeros.style.setProperty('transition-delay', '2.2s');
    validacaoLetrasM.style.setProperty('transition-delay', '2.4s');
    txValidacaoLetrasM.style.setProperty('transition-delay', '2.4s');
    validacaoCaracEspeciais.style.setProperty('transition-delay', '2.6s');
    txValidacaoCaracEspeciais.style.setProperty('transition-delay', '2.6s');
    txCardConfirmarSenhaCadastro.style.setProperty('transition-delay', '3.1s');
    tbCardConfirmarSenhaCadastro.style.setProperty('transition-delay', '3.1s');
    txCardConfirmarSenhaCadastroInvalida.style.setProperty('transition-delay', '3.1s');


    txCardNomeCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardNomeCadastro.style.setProperty('transition-duration', '0.5s');
    txCardNomeCadastroInvalido.style.setProperty('transition-duration', '0.5s');
    txCardEmailCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardEmailCadastro.style.setProperty('transition-duration', '0.5s');
    txCardEmailCadastroInvalido.style.setProperty('transition-duration', '0.5s');
    txCardCNPJCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardCNPJCadastro.style.setProperty('transition-duration', '0.5s');
    txCardCNPJCadastroInvalido.style.setProperty('transition-duration', '0.5s');
    txCardSenhaCadastro.style.setProperty('transition-duration', '0.5s');
    tbCardSenhaCadastro.style.setProperty('transition-duration', '0.5s');
    txCardSenhaCadastroInvalida.style.setProperty('transition-duration', '0.5s');
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
    txCardConfirmarSenhaCadastroInvalida.style.setProperty('transition-duration', '0.5s');

    txCardNomeCadastro.style.setProperty('visibility', 'visible');
    tbCardNomeCadastro.style.setProperty('visibility', 'visible');
    txCardNomeCadastroInvalido.style.setProperty('visibility', 'visible');
    txCardEmailCadastro.style.setProperty('visibility', 'visible');
    tbCardEmailCadastro.style.setProperty('visibility', 'visible');
    txCardEmailCadastroInvalido.style.setProperty('visibility', 'visible');
    txCardCNPJCadastro.style.setProperty('visibility', 'visible');
    tbCardCNPJCadastro.style.setProperty('visibility', 'visible');
    txCardCNPJCadastroInvalido.style.setProperty('visibility', 'visible');
    txCardSenhaCadastro.style.setProperty('visibility', 'visible');
    tbCardSenhaCadastro.style.setProperty('visibility', 'visible');
    txCardSenhaCadastroInvalida.style.setProperty('visibility', 'visible');
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
    txCardConfirmarSenhaCadastroInvalida.style.setProperty('visibility', 'visible');

    txCardNomeCadastro.style.setProperty('opacity', '100%');
    tbCardNomeCadastro.style.setProperty('opacity', '100%');
    txCardNomeCadastroInvalido.style.setProperty('opacity', '100%');
    txCardEmailCadastro.style.setProperty('opacity', '100%');
    tbCardEmailCadastro.style.setProperty('opacity', '100%');
    txCardEmailCadastroInvalido.style.setProperty('opacity', '100%');
    txCardCNPJCadastro.style.setProperty('opacity', '100%');
    tbCardCNPJCadastro.style.setProperty('opacity', '100%');
    txCardCNPJCadastroInvalido.style.setProperty('opacity', '100%');
    txCardSenhaCadastro.style.setProperty('opacity', '100%');
    tbCardSenhaCadastro.style.setProperty('opacity', '100%');
    txCardSenhaCadastroInvalida.style.setProperty('opacity', '100%');
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
    txCardConfirmarSenhaCadastroInvalida.style.setProperty('opacity', '100%');

  }

  cadastrarPessoaJuridica(){
    const cardCadastro = document.getElementById("cardCadastro");
    cardCadastro.style.setProperty('visibility', 'hidden');
  }


}
