import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';


//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

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
// //  Login usuarios existentes
// //
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });

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


  constructor() { }

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
      // Signed in
      const user = userCredential.user;
      alert("Usuario criado! " + user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Falha ao criar usuário! " + error.message + " Cod. Error: " + error.code);
  
      // ..
    });
  }


}
