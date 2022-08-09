import { Component, Injectable, NgModule, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform} from '@ionic/angular';
import { Routes, RouterModule, NavigationExtras } from '@angular/router';
import { Tab1Page } from '../tab1/tab1.page';
import { RouterOutlet, Router, ActivationStart } from '@angular/router';

import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult  } from "firebase/auth";

//firestore
import { doc, setDoc, getFirestore, query, where } from "firebase/firestore";

const auth = getAuth();


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
const email:string = null;
const password:string = null;

// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

@Component({
  selector: 'app-initial',
  templateUrl: './initial.page.html',
  styleUrls: ['./initial.page.scss'],
})
export class InitialPage implements OnInit {
  routes : Routes;
  @ViewChild(RouterOutlet) outlet: RouterOutlet;
  @ViewChild('myNav') nav: NavController
  public emailLogin:string;
  public senhaLogin:string;
  public selectPerfil = [];

  constructor(public navCtrl: NavController, public router: Router, private platform: Platform, private storage: Storage) {


    onAuthStateChanged( auth, (user) => {
      if(user){
        const uid = user.uid;
        this.router.navigate(['/home/tabs/tab2']);
      }else{
        // Usuario deslogado
      }
    })
   }

   ngOnInit(){
   }



  recuperarSenha(){
    this.router.navigate(['/recuperar-senha']);
  }


  emailInvalido(invalido: boolean){
    // const tbEmail = document.getElementById("tbCardEmail");
    // const txEmailInvalido = document.getElementById("txCardEmailInvalido");

    // if(invalido){
    //   tbEmail.style.borderColor = "red";
    //   txEmailInvalido.style.setProperty('visibility', 'visible');  
    // }else{
    //   tbEmail.style.borderColor = "transparent";
    //   txEmailInvalido.style.setProperty('visibility', 'hidden');  
    // }
  }

  senhaInvalido(invalido: boolean){
    // const tbSenha = document.getElementById("tbCardSenha");
    // const txSenhaInvalido = document.getElementById("txCardSenhaInvalida");

    // if(invalido){
    //   tbSenha.style.borderColor = "red";
    //   txSenhaInvalido.style.setProperty('visibility', 'visible');
    // }else{
    //   tbSenha.style.borderColor = "transparent";
    //   txSenhaInvalido.style.setProperty('visibility', 'hidden');
    // }
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
      this.router.navigate(['/home/tabs/tab2']);
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

  abrirCadastro(){
    window.location.href = "/cadastro";
  }

  loginWithGoogle(){
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  }

  loginWithFacebook(){
    const auth = getAuth();
  }

}

