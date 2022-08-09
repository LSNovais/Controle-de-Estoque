import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';  

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult, signOut  } from "firebase/auth";

//firestore
import { doc, setDoc, getFirestore, query, where, onSnapshot  } from "firebase/firestore";

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


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public nomeUsuario:string;
  public emailUsuario:string;
  public cpfUsuario:string;
  public sexoUsuario:string;
  public dataNascimentoUsuario:string;
  public celularUsuario:number;
  public posicaoUsuarioEmpr:string;

  public produtosCadastrados = [];

  public codEmpresa:string;
  public valProdutosCadastrados:number;
  public valProdutosVendidos:number = 0;
  public valTotal:number = 0;

  public selectReports = [];
  public selectDuvidas = [];
  public selectPerfil = [];
  public produtosVendidosMes = [];

  public i = 0;
  public x = 0;
  
  lineChart: any;

  constructor(public modalCtrl: ModalController) {
    const user = auth.currentUser;

    if( user !== null ){
      user.providerData.forEach((profile) => {
        this.emailUsuario = profile.email;
        this.consultaPerfil();
      });
    }
   }


  async consultaPerfil(){

    const q = query(collection(db, "usuarios"), where("email", "==", this.emailUsuario));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.selectPerfil[0] = doc.data();
    });

    this.nomeUsuario = this.selectPerfil[0].nome;
    this.emailUsuario = this.selectPerfil[0].email;
    this.cpfUsuario = this.selectPerfil[0].cpf;
    this.sexoUsuario = this.selectPerfil[0].sexo;
    this.dataNascimentoUsuario = this.selectPerfil[0].dt_nascimento;
    this.celularUsuario = this.selectPerfil[0].celular;
    this.codEmpresa = this.selectPerfil[0].cod_empresa;
    this.valProdutosCadastrados = 0;

    //Empresa
    if( this.codEmpresa !== null ){
      let produtos = [];
      this.valProdutosCadastrados = 0;

      const q = query(collection(db, "produtos"), where("cod_unico", "==", this.codEmpresa));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.valProdutosCadastrados += (parseFloat(doc.data().quantidade_produto) * parseFloat(doc.data().preco));
        });        
        alert(this.valProdutosCadastrados)
        this.valTotal = this.valProdutosVendidos - this.valProdutosCadastrados;
    
      });

    }else{
      const qu = query(collection(db, "produtos"), where("cod_unico", "==", this.emailUsuario));
  
      const querySnapshotQu = await getDocs(qu);
      querySnapshotQu.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if(doc.data()[this.valProdutosCadastrados] !== null){
          this.valProdutosCadastrados++;
        }
      });
    }
  }

  ngOnInit() {
  }

}
