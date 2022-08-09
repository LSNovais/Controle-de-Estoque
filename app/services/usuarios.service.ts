import { Injectable } from '@angular/core';

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult, sendEmailVerification  } from "firebase/auth";

//firestore
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { Observable } from 'rxjs';


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


export interface Usuarios{
  celular:string;
  cod_empresa:string;
  cpf:string;
  dt_nascimento:string;
  email:string;
  nome:string;
  sexo:string;
  sts_ativo:number;
  perfil:number;
}
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor() { }


  createUser(Usuarios, senha:string) :Promise<any>{

    const auth = getAuth();
    var retorno = null;
    createUserWithEmailAndPassword(auth, Usuarios.email, senha)
    .then(async (userCredential) => {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const user = userCredential.user;
      try {
        const docRef = await setDoc(doc(db, "usuarios", Usuarios.email), {
          celular: Usuarios.celular,
          cod_empresa: Usuarios.cod_empresa,
          cpf: Usuarios.cpf,
          dt_nascimento: Usuarios.dt_nascimento,
          email: Usuarios.email,
          nome: Usuarios.nome,
          sexo: Usuarios.sexo,
          sts_ativo: Usuarios.sts_ativo,
          perfil: Usuarios.perfil
        });
        alert("Document written with ID: "+ docRef);
        await sendEmailVerification(auth.currentUser).then(() => {
          retorno = "Cadastro Realizado";
          alert(retorno)
          return new Promise(retorno);
        });
      } catch (e) {
        console.error("Error adding document: ", e);
        return retorno.toPromise().then(function(data){
          return  data; 
        });   
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      retorno = errorCode;
      return retorno.toPromise().then(function(data){
        return  data; 
      });    
    });
    return retorno.toPromise().then(function(data){
      return  data; 
    });   
  }



  
}
