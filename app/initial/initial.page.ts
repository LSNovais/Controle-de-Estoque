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
  public email:string;
  public password:string;


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

  avancarSlider(){
    this.slide1.slideNext();
  }

  createUser(){
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Usuario criado! " + user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Falha ao criar usuário! " + errorMessage + " Cod. Error: " + errorCode);
    });
  }

  loginUser(){
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Bem vindo! " + user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Falha ao realizar login! " + errorMessage + " Cod. Error: " + errorCode);
    });
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


}
