import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform} from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { Tab1Page } from '../tab1/tab1.page';
import { RouterOutlet, Router, ActivationStart } from '@angular/router';

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult, sendEmailVerification, signOut  } from "firebase/auth";

//firestore
import { doc, setDoc, getFirestore } from "firebase/firestore";


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
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  public validaNomeCadastro:boolean;
  public validaEmailCadastro:boolean;
  public validaSenhaCadastro:boolean;
  public validaConfirmSenhaCadastro:boolean;
  public nomeCadastro:string;
  public cpfUsuario:string = null;
  public emailCadastro:string;
  public txEmailCadastroInvalido:string;
  public senhaCadastro:string = null;
  public confirmarSenhaCadastro:string;

  constructor() { 
    this.txEmailCadastroInvalido = "E-mail inválido!"

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      } else {
        // User is signed out
        // ...
      }
    });

    getRedirectResult(auth).then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      window.location.href = "/home/tabs/tab2?user="+user;

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
    })

  }

  ngOnInit() {
  }

  createUser(){

    if( (this.validaNomeCadastro) && (this.validaEmailCadastro) && (this.validaSenhaCadastro) && (this.validaConfirmSenhaCadastro) ){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.emailCadastro, this.senhaCadastro)
      .then(async (userCredential) => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const user = userCredential.user;
        try {
          const docRef = await setDoc(doc(db, "usuarios", this.emailCadastro), {
            celular: null,
            tipoLogin: "Padrao",
            urlFotoPerfil: null,
            emailVerificado: false,
            cod_empresa: null,
            cpf: this.cpfUsuario,
            dt_nascimento: null,
            email: this.emailCadastro,
            nome: this.nomeCadastro,
            sexo: null,
            sts_ativo: 1,
            perfil: 2
          });
          console.log("Document written with ID: ", docRef);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        sendEmailVerification(auth.currentUser).then(() => {
          signOut(auth).then(async () => {
            window.location.href = "/cadastro-realizado";
          }).catch((error) => {
            alert("Falha ao deslogar!")
          });
        })
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

  perdaFocoNomeCad(){
    const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    const txCardNomeCadastroInvalido = document.getElementById("txCardNomeCadastroInvalido");
    const tbCardNomeCadastro = document.getElementById("tbCardNomeCadastro");

    if( this.nomeCadastro == null || !regex.test(this.nomeCadastro) ){
      tbCardNomeCadastro.style.setProperty('border-color', 'red');    
      this.validaNomeCadastro = false;
    }else{
      tbCardNomeCadastro.style.setProperty('border-color', 'rgba(167, 167, 167, 0.5)');    
      this.validaNomeCadastro = true;
    }
  }

  perdaFocoEmailCad(){
    const txCardEmailCadastroInvalido = document.getElementById("txCardEmailCadastroInvalido");
    const tbCardEmailCadastro = document.getElementById("tbCardEmailCadastro");

    if( this.emailCadastro == null || !this.emailCadastro.includes('@') || !this.emailCadastro.includes('.') ){
      tbCardEmailCadastro.style.setProperty('border-color', 'red');   
      this.validaEmailCadastro = false;
    }else{
      tbCardEmailCadastro.style.setProperty('border-color', 'rgba(167, 167, 167, 0.5)');    
      this.validaEmailCadastro = true;
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

    if( this.senhaCadastro !== null ){
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

  }

  perdaFocoSenhaCad(){
    const validacaoDigitos = document.getElementById("txValidacaoDigitos");
    const validacaoLetrasNumeros = document.getElementById("txValidacaoLetrasNumeros");
    const validacaoLetrasM = document.getElementById("txValidacaoLetrasM");
    const validacaoCaracEspeciais = document.getElementById("txValidacaoCaracEspeciais");

    if( this.senhaCadastro !== null){
      if( this.senhaCadastro.length == 0 ){
        validacaoDigitos.style.setProperty('color', "#afafaf");    
        validacaoLetrasNumeros.style.setProperty('color', '#afafaf');    
        validacaoLetrasM.style.setProperty('color', '#afafaf');    
        validacaoCaracEspeciais.style.setProperty('color', '#afafaf');    
      }
    }
  }

  perdaFocoConfirSenhaCad(){
    const tbCardConfirmarSenhaCadastro = document.getElementById("tbCardConfirmarSenhaCadastro");

    if(this.senhaCadastro !== this.confirmarSenhaCadastro){
      tbCardConfirmarSenhaCadastro.style.setProperty('border-color', 'red');    
      this.validaConfirmSenhaCadastro = false;
    }else{
      tbCardConfirmarSenhaCadastro.style.setProperty('border-color', 'rgba(167, 167, 167, 0.5)');   
      this.validaConfirmSenhaCadastro = true; 
    }
  }


  


  cancelarCadastro(){
    window.location.href = "/login";
  }

}
