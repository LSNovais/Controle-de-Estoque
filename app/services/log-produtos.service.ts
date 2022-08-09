import { Injectable } from '@angular/core';

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult, sendEmailVerification  } from "firebase/auth";

//firestore
import { doc, setDoc, getFirestore, where, query, Timestamp } from "firebase/firestore";
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


export interface Usuario{
  celular:string;
  cod_empresa:string;
  cpf:string;
  dt_nascimento:string;
  email:string;
  img_perfil;
  nome:string;
  sexo:string;
  sts_ativo:number;
}
export interface LogProdutos{
    cod_log:number;
    cod_produto:number;
    cod_unico:string;
    data_acao:string;
    desc_acao:string;
    usuario:string;
}
export interface RetornoLogProdutos{
    img_perfil;
    nome:string;
    cod_unico:string;
    data_acao:string;
    desc_acao:string;
    usuario:string;
}
@Injectable({
  providedIn: 'root'
})
export class LogProdutosService {
    public dbUsuario: Usuario;
    public dbLogProdutos: LogProdutos;
    public dbRetornoLogProdutos: RetornoLogProdutos;
    public sizeLogProdutos:number = 0;

    constructor() { }



    async consultaLogProduto(usuario: Usuario, logProdutos: LogProdutos){

        const myPromise = new Promise(async (resolve, reject) => {


            // Falta separar cada unidade do log encontrado (retornara varios)
            //
            const qLogProduto = query(collection(db, "log_produto"), where("cod_unico", "==", logProdutos.cod_unico));

            const querySnapshotLogProduto = await getDocs(qLogProduto);
            querySnapshotLogProduto.forEach((doc) => {
                this.dbLogProdutos = doc.data()[0];
            });


            const q = query(collection(db, "usuarios"), where("email", "==", this.dbLogProdutos.usuario));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.dbUsuario = doc.data()[0];
            });


            this.dbRetornoLogProdutos.img_perfil = this.dbUsuario.img_perfil;
            this.dbRetornoLogProdutos.nome = this.dbUsuario.nome;
            this.dbRetornoLogProdutos.cod_unico = this.dbLogProdutos.cod_unico;
            this.dbRetornoLogProdutos.data_acao = this.dbLogProdutos.data_acao;
            this.dbRetornoLogProdutos.desc_acao = this.dbLogProdutos.desc_acao;
            this.dbRetornoLogProdutos.usuario = this.dbLogProdutos.usuario;

            return this.dbRetornoLogProdutos;
        });
    }

    async salvarLogProduto(logProdutos: LogProdutos){

        const myPromise = new Promise(async (resolve, reject) => {
            // perform asynchronous task which might either be:
            //
            const qLogProduto = query(collection(db, "log_produto"), where("cod_unico", "==", logProdutos.cod_unico));

            const querySnapshotLogProduto = await getDocs(qLogProduto);
            querySnapshotLogProduto.forEach((doc) => {
                this.sizeLogProdutos ++;
            });

            let key = logProdutos.cod_unico + "\\" + (this.sizeLogProdutos++);
            const docRef = await setDoc(doc(db, "log_produto", key), {
                cod_log: logProdutos.cod_log,
                cod_produto: logProdutos.cod_produto,
                cod_unico: logProdutos.cod_unico,
                data_acao: logProdutos.data_acao,
                desc_acao: logProdutos.desc_acao,
                usuario: logProdutos.usuario
            });


            return this.dbRetornoLogProdutos;
        });
    }



  
}
