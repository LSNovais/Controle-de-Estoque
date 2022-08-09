import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController} from '@ionic/angular';  

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult  } from "firebase/auth";

//firestore
import { doc, setDoc, getFirestore, query, where } from "firebase/firestore";

//Route
import { ActivatedRoute, Router } from '@angular/router';

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

@Component({
  selector: 'app-edit-produtos',
  templateUrl: './edit-produtos.page.html',
  styleUrls: ['./edit-produtos.page.scss'],
})
export class EditProdutosPage implements OnInit {

  public x:number = 0;
  public selectQuantidade;

  //Route produto tela anterior
  public jProd;
  public jsonProduto;
  
  //Cadastro produto
  public codUnico:string = null;
  public dataCadastro:string=  null;
  public codBarrasProduto:number = 0;
  public nomeProduto:string = null;
  public usuarioCadastro:string = null;
  public pesoProduto:number = 0;
  public precoProduto:number = 0;
  public tipoAcaoBotao:string = null;
  public selectQuantProduto = [] ;

  //Usuario logado
  public emailUsuario:string;
  public selectPerfil = [];


  constructor(public modalCtrl: ModalController, private route: ActivatedRoute, public router: Router, public toastController: ToastController) {
    const user = auth.currentUser;
    if (user !== null) {
      this.emailUsuario = user.email;
    }
    

    this.jProd = this.route.params.subscribe(params => {
      this.jsonProduto = params; 

      if( this.jsonProduto == null ){
        this.router.navigate(['/home/tabs/tab3']);
      }

      if( this.jsonProduto.sts_novo_produto == "true" ){
        
        this.tipoAcaoBotao = "Cadastrar Produto";
        this.nomeProduto = this.jsonProduto.nom_produto;
        this.usuarioCadastro = this.jsonProduto.usuario_cadastro;
        this.codBarrasProduto = null;
        this.dataCadastro = null;
        this.pesoProduto = null;
        this.selectQuantidade = null;
        this.precoProduto = null;

      }else{

        this.nomeProduto = this.jsonProduto.nom_produto;
        this.usuarioCadastro = this.jsonProduto.usuario_cadastro;
        this.codBarrasProduto = this.jsonProduto.cod_barras;
        this.dataCadastro = this.jsonProduto.dataCadastro;
        this.pesoProduto = this.jsonProduto.peso;
        this.selectQuantidade = this.jsonProduto.quantidade_produto;
        this.precoProduto = this.jsonProduto.preco;
        this.tipoAcaoBotao = "Atualizar Produto";

      }
    });

  }

  ngOnInit() {
  }

  async presentToastWithOptions(message:string, stsSucesso:boolean) {
    var cor;
    var icon;
    if(stsSucesso){
      cor = 'success';
      icon = 'checkmark-circle-outline';
    }else{
      cor = 'danger';
      icon = 'close-circle-outline';

    }
    const toast = await this.toastController.create({
      // header: 'Toast header',
      message: message,
      icon: icon,
      color: cor,
      position: 'top',
      duration: 2000
    });
    await toast.present();

  }

  cancelarAcaoProduto(){
    this.route.params = null;
    this.jProd = null;
    this.jsonProduto = null;
    this.nomeProduto = null;
    this.usuarioCadastro = null;
    this.codBarrasProduto = null;
    this.dataCadastro = null;
    this.pesoProduto = null;
    this.selectQuantidade = null;
    this.precoProduto = null;
    this.tipoAcaoBotao = null;
    this.router.navigate(['/home/tabs/tab3']);
  }

  async acaoProduto(){
    alert(this.selectQuantidade)

    const q = query(collection(db, "usuarios"), where("email", "==", this.emailUsuario));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.selectPerfil[0] = doc.data();
    });

    if( this.selectPerfil[0] && this.selectPerfil[0].cod_empresa ){
      this.codUnico = this.selectPerfil[0].cod_empresa;
    }else{
      this.codUnico = this.emailUsuario;
    }


    if( this.jsonProduto.sts_novo_produto == "true" ){

      const queryQuantProd = query(collection(db, "produtos"), where("cod_unico", "==", this.codUnico), where("sts_ativo", "==", true));
      const querySnapshotQuantProd = await getDocs(queryQuantProd);
      querySnapshotQuantProd.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.selectQuantProduto.push(doc.data());
      });      
      let newDate = new Date();
      const docRef = await setDoc(doc(db, "produtos", this.codUnico+"\\"+(100000+this.selectQuantProduto.length+1)), {
        categoria:"Alimenticio",//TO-DO alterar
        cod_barras:(100000+this.selectQuantProduto.length+1),
        cod_unico:this.codUnico,
        nom_produto:this.nomeProduto,
        peso:this.pesoProduto,
        tipo_peso:"Kg",//TO-DO alterar
        preco:this.precoProduto,
        quantidade_produto:this.selectQuantidade,
        dt_cadastro:newDate,
        usuario_cadastro:this.usuarioCadastro,
        sts_ativo: true
      });
      this.codBarrasProduto = (100000+this.selectQuantProduto.length+1);
      this.presentToastWithOptions("Produto adicionado com sucesso!", true);
      this.cancelarAcaoProduto();
      console.log("Document written with ID: ", docRef);
  
    }else{
      const docRef = await setDoc(doc(db, "produtos", this.codUnico+"\\"+this.codBarrasProduto), {
        categoria:"Alimenticio",//TO-DO alterar
        cod_barras:this.codBarrasProduto,
        cod_unico:this.codUnico,
        nom_produto:this.nomeProduto,
        peso:this.pesoProduto,
        tipo_peso:"Kg",//TO-DO alterar
        preco:this.precoProduto,
        quantidade_produto:this.selectQuantidade,
        dt_cadastro:this.dataCadastro,
        usuario_cadastro:this.usuarioCadastro,
        sts_ativo: true
      });
      this.presentToastWithOptions("Produto atualizado com sucesso!", true);
      this.cancelarAcaoProduto();
      console.log("Document written with ID: ", docRef);
    }

  }
}
