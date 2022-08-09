import { Component, Injectable, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';
import { ModalController} from '@ionic/angular';  
import { ProdutosPage } from '../produtos/produtos.page';
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

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  // Typically referenced to your ion-router-outlet
  presentingElement = null;
  dataRoute: any;
  public isTab2:boolean = true;
  public selectPerfil = [];

  constructor(private route: ActivatedRoute, private router: Router, private storage: Storage, public modalCtrl: ModalController){

    getRedirectResult(auth)
    .then(async (result) => {

      const user = auth.currentUser;
      user.providerData.forEach((profile) => {
        // alert("Sign-in provider: " + profile.providerId);
        // alert("  Provider-specific UID: " + profile.uid);
        // alert("  Name: " + profile.displayName);
        // alert("  Email: " + profile.email);
        // alert("  Photo URL: " + profile.photoURL);
      });
  
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if( credential !== null ){
        const token = credential.accessToken;

        if (user !== null) {
          const displayName = user.displayName;
          const email = user.email;
          const photoURL = user.photoURL;
          const emailVerified = user.emailVerified;
          const uid = user.uid;

          try{

            const q = query(collection(db, "usuarios"), where("email", "==", email));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.selectPerfil[0] = doc.data();
            });

            if( this.selectPerfil[0] == null || this.selectPerfil[0].email == null){
              console.log("Login with google 5");

              const docRef = await setDoc(doc(db, "usuarios", email), {
                celular: null,
                tipoLogin: "Google",
                urlFotoPerfil: photoURL,
                emailVerificado: emailVerified,
                cod_empresa: null,
                cpf: null,
                dt_nascimento: null,
                email: email,
                nome: displayName,
                sexo: null,
                sts_ativo: 1,
                perfil: 2
              });
              console.log("Document written with ID: ", docRef);

              this.router.navigate(['/home/tabs/tab2']);

            }else{
              this.router.navigate(['/home/tabs/tab2']);

            }
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      }
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });




    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.dataRoute = JSON.parse(params.special);
        console.log("Document written with ID: ", this.dataRoute.email);
      }
    });

  }

  ionViewDidLeave(){
    this.modalCtrl.dismiss();
    this.isTab2 = false;
  }

  async ionViewDidEnter(){
    this.isTab2 = true;
  }

  async ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    await this.storage.set('email', this.dataRoute.email);
  }


  async clickItem(acao: any){
    if( acao == 0 ){
      this.modalCtrl.dismiss();
      this.isTab2 = false;
      const modalPageProduto = await this.modalCtrl.create({
        component: ProdutosPage
      });
      return await modalPageProduto.present();
  
    }

  }

  isItemAvailable = true;
  items = [
    {tipo:"Consultar Produto", subTipo:"Cadastrar, Atualizar, Excluir produtos...", logo:"search-outline", acao: 0},
    {tipo:"Excluir Produtos", subTipo:"Realiza a exclusão de produtos em lote...", logo:"close-circle-outline", acao: 1},
    {tipo:"Exportar Dados", subTipo:"Exportar dados e métricas via e-mail...", logo:"exit-outline", acao: 2},
    {tipo:"Consultar Receitas", subTipo:"Cadastrar, Atualizar, Excluir receitas...", logo:"fast-food-outline", acao: 3},
    {tipo:"Gerenciar Assinatura", subTipo:"Gerenciar assinaturas da sua conta e empresa...", logo:"bag-check-outline", acao: 4},
    {tipo:"Tabela Nutricional", subTipo:"Cadastrar dados nutricionais...", logo:"bag-check-outline", acao: 5}
  ];

  getItems(ev: any) {
    this.items = [
      {tipo:"Consultar Produto", subTipo:"Cadastrar, Atualizar, Excluir produtos...", logo:"search-outline", acao: 0},
      {tipo:"Excluir Produtos", subTipo:"Realiza a exclusão de produtos em lote...", logo:"close-circle-outline", acao: 1},
      {tipo:"Exportar Dados", subTipo:"Exportar dados e métricas via e-mail...", logo:"exit-outline", acao: 2},
      {tipo:"Consultar Receitas", subTipo:"Cadastrar, Atualizar, Excluir receitas...", logo:"fast-food-outline", acao: 3},
      {tipo:"Gerenciar Assinatura", subTipo:"Gerenciar assinaturas da sua conta e empresa...", logo:"bag-check-outline", acao: 4},
      {tipo:"Tabela Nutricional", subTipo:"Cadastrar dados nutricionais...", logo:"bag-check-outline", acao: 5}
    ];
  


      // set val to the value of the searchbar
      const val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() !== '') {
          this.isItemAvailable = true;
          this.items = this.items.filter((item) => {
              return (item.tipo.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
      } else if (val === '') {
        return this.items;
      }else {
          this.isItemAvailable = false;
      }
  }
  
}
