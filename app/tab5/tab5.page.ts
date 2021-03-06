import { Component, OnInit, Injectable, NgModule } from '@angular/core';

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult, signOut  } from "firebase/auth";

//firestore
import { doc, setDoc, getFirestore, query, where } from "firebase/firestore";
import { ActivatedRoute, Router } from '@angular/router';

//Local database
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';

import { AlertController } from '@ionic/angular';
import { ModalController} from '@ionic/angular';  
import { ToastController } from '@ionic/angular';


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
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  public nomeUsuario:string;
  public emailUsuario:string;
  public cpfUsuario:string;
  public sexoUsuario:string;
  public dataNascimentoUsuario:string;
  public celularUsuario:number;
  public posicaoUsuarioEmpr:string;

  public sincDadosEmpresa:boolean;
  public emailUsuarioCriador:string;
  public btSalvarEditarEmpresa:string = "Editar Dados";
  public isUsuarioCriador:boolean;
  public editarDadosEmpresa:boolean = false;
  public isCadastroNovaEmpresa:boolean = false;
  public consultaEmpresa:string;
  public retornoQueryConsultEmpresa:string = null;
  public nomeEmpresa:string =null;
  public codEmpresa:string;
  public cnpjEmpresa:string;
  public emailEmpresa:string;
  public contatoEmpresa:string;
  public selectEmpresa = [];

  public selectReports = [];
  public selectDuvidas = [];
  public selectPerfil = [];

  public i = 0;
  public x = 0;
  
  dataRoute: any;


  constructor(public router: Router, private storage: Storage, private alertController: AlertController, public modalCtrl: ModalController, public toastController: ToastController){
  }
  async ngOnInit() {
    const user = auth.currentUser;

    if( user !== null ){
      user.providerData.forEach((profile) => {
        this.emailUsuario = profile.email;
        this.consultaPerfil();
        this.consultaFalha();
        this.consultaDuvida();
  
      });
    }
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

  async sairConta(){
    signOut(auth).then(async () => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      alert("Falha ao deslogar!")
    });
  }


  options = {
    // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
    // selection of a single image, the plugin will return it.
    maximumImagesCount:1,
    
    // max width and height to allow the images to be.  Will keep aspect
    // ratio no matter what.  So if both are 800, the returned image
    // will be at most 800 pixels wide and 800 pixels tall.  If the width is
    // 800 and height 0 the image will be 800 pixels wide if the source
    // is at least that wide.
    width: 30,
    height: 30,
    
    // quality of resized image, defaults to 100
    quality: 100,

    // output type, defaults to FILE_URIs.
    // available options are 
    // window.imagePicker.OutputType.FILE_URI (0) or 
    // window.imagePicker.OutputType.BASE64_STRING (1)
    outputType: 1
};



  // Inicio Aba Perfil
  async consultaPerfil(){
    this.selectEmpresa[0] = null;
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

    //Empresa
    if( this.codEmpresa !== null ){
      const qu = query(collection(db, "empresas"), where("cod_unico", "==", this.codEmpresa));
  
      const querySnapshotQu = await getDocs(qu);
      querySnapshotQu.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.selectEmpresa[0] = doc.data();
      });

      if(this.selectEmpresa[0] !== null){
        console.log("Empresa encontrada")
        this.nomeEmpresa = this.selectEmpresa[0].nome_empresa;
        this.cnpjEmpresa = this.selectEmpresa[0].cnpj;
        this.emailEmpresa  = this.selectEmpresa[0].email;
        this.contatoEmpresa  = this.selectEmpresa[0].contato;
        this.emailUsuarioCriador = this.selectEmpresa[0].criador;
        if( this.emailUsuarioCriador == this.emailUsuario ){
          this.posicaoUsuarioEmpr = "Administrador";
          this.isUsuarioCriador = true;
        }else{
          this.posicaoUsuarioEmpr = "Funcion??rio";
          this.isUsuarioCriador = false;
        }
        this.sincDadosEmpresa = true;

        const gridEmpresa = document.getElementById("gridEmpresa");
        const listEmpresa = document.getElementById("listEmpresa");
        const salvarEmpresa = document.getElementById("salvarEmpresa");
        gridEmpresa.style.setProperty('visibility', 'visible');
        listEmpresa.style.setProperty('visibility', 'visible');
        salvarEmpresa.style.setProperty('visibility', 'visible');
      }else{
        // alert("Empresa n??o encontrada!");
      }

    }


  }

  async salvarPerfil(){
    try {
      const docRef = await setDoc(doc(db, "usuarios", this.emailUsuario), {
        email: this.emailUsuario,
        nome: this.nomeUsuario,
        celular: this.celularUsuario,
        cpf: this.cpfUsuario,
        dt_nascimento: this.dataNascimentoUsuario,
        sexo: this.sexoUsuario,
        cod_empresa: this.codEmpresa
      });
      this.modalCtrl.dismiss();
      this.presentToastWithOptions("Perfil atualizado com sucesso!", true);
      console.log("Document written with ID: ", docRef);
    } catch (e) {
      this.presentToastWithOptions("Falha ao atualizar perfil!", false);
      console.error("Error adding document: ", e);
    }
  }
  // Fim Aba Perfil



  // Inicio Aba Empresa
  async salvarEmpresa(){
    if(this.editarDadosEmpresa && this.isUsuarioCriador){
      if(this.isCadastroNovaEmpresa){
        try {
          const docRef = await setDoc(doc(db, "empresas", this.nomeEmpresa), {
            email: this.emailEmpresa,
            nome_empresa: this.nomeEmpresa,
            contato: this.contatoEmpresa,
            cnpj: this.cnpjEmpresa,
            cod_unico: this.nomeEmpresa+"#232",
            criador: this.emailUsuario,
            sts_ativo: true
          });
          console.log("Document written with ID: ", docRef);
          this.btSalvarEditarEmpresa = "Editar Dados";
          this.editarDadosEmpresa = false;
          this.modalCtrl.dismiss();
        } catch (e) {
          console.error("Error adding document: ", e);
          this.presentToastWithOptions("Falha ao criar empresa!",false);
        }
        this.presentToastWithOptions("Empresa criada com sucesso!",true);
      }else{
        try {
          const docRef = await setDoc(doc(db, "empresas", this.nomeEmpresa), {
            email: this.emailEmpresa,
            nome_empresa: this.nomeEmpresa,
            contato: this.contatoEmpresa,
            cnpj: this.cnpjEmpresa,
            cod_unico: this.codEmpresa,
            criador: this.emailUsuarioCriador,
            sts_ativo: true
          });
          console.log("Document written with ID: ", docRef);
          this.btSalvarEditarEmpresa = "Editar Dados";
          this.editarDadosEmpresa = false;
          this.modalCtrl.dismiss();
        } catch (e) {
          console.error("Error adding document: ", e);
          this.presentToastWithOptions("Falha ao atualizar dados da empresa!",false);
        }
        this.presentToastWithOptions("Dados da empresa atualizados com sucesso!",true);
      }



      
    }else{
      this.editarDadosEmpresa = true;
    }

  }

  async ativarSincEmpresa(){
    if( this.sincDadosEmpresa && this.nomeEmpresa == null ){
      const alert = await this.alertController.create({
        header: 'Encontre ou cadastre uma empresa!',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              this.sincDadosEmpresa = false;
            }
          }, 
          {
              text: 'Ok',
              handler: (alertData) => { //takes the data 
                  this.consultaEmpresa = alertData.dadoConsultaEmpresa;
                  this.consultaEmpresaBanco();
              }
          }
        ],
        inputs: [
          {
            name: 'dadoConsultaEmpresa',
            placeholder: 'Nome, CNPJ ou C??digo ??nico.',
            type: 'text'
          }
        ]
      });
  
      await alert.present();

    }else if(this.sincDadosEmpresa == false && this.nomeEmpresa !== null){
      try {

        const docRef = await setDoc(doc(db, "usuarios", this.emailUsuario), {
          email: this.emailUsuario,
          nome: this.nomeUsuario,
          celular: this.celularUsuario,
          cpf: this.cpfUsuario,
          dt_nascimento: this.dataNascimentoUsuario,
          sexo: this.sexoUsuario,
          cod_empresa: null,
          sts_ativo: true
        });

        this.nomeEmpresa = null;
        this.cnpjEmpresa = null;
        this.emailEmpresa  = null;
        this.contatoEmpresa  = null;
        this.codEmpresa = null;
        this.emailUsuarioCriador = null;
        this.posicaoUsuarioEmpr = null;

        const gridEmpresa = document.getElementById("gridEmpresa");
        const listEmpresa = document.getElementById("listEmpresa");
        const salvarEmpresa = document.getElementById("salvarEmpresa");
        gridEmpresa.style.setProperty('visibility', 'hidden');
        listEmpresa.style.setProperty('visibility', 'hidden');
        salvarEmpresa.style.setProperty('visibility', 'hidden');

      } catch (e) {
        alert("Error adding document: "+ e);
      }
    }else if(this.sincDadosEmpresa == true && this.nomeEmpresa !== null){
      const gridEmpresa = document.getElementById("gridEmpresa");
      const listEmpresa = document.getElementById("listEmpresa");
      const salvarEmpresa = document.getElementById("salvarEmpresa");
      gridEmpresa.style.setProperty('visibility', 'visible');
      listEmpresa.style.setProperty('visibility', 'visible');
      salvarEmpresa.style.setProperty('visibility', 'visible');

    }else{
      const gridEmpresa = document.getElementById("gridEmpresa");
      const listEmpresa = document.getElementById("listEmpresa");
      const salvarEmpresa = document.getElementById("salvarEmpresa");
      gridEmpresa.style.setProperty('visibility', 'hidden');
      listEmpresa.style.setProperty('visibility', 'hidden');
      salvarEmpresa.style.setProperty('visibility', 'hidden');
    }
  }

  editarDados(){
    if(!this.editarDadosEmpresa){
      this.btSalvarEditarEmpresa = "Editar Dados";
      return true;
    }else{
      this.btSalvarEditarEmpresa = "Salvar";
      return false;
    }
  }

  usuarioCriador(){
    return !this.isUsuarioCriador;
  }

  async consultaEmpresaQuery(campo:string, consulta:string):Promise<string>{
    this.selectEmpresa[0] = null;
    const q = query(collection(db, "empresas"), where(campo, "==", consulta));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.selectEmpresa[0] = doc.data();
    });

    if(this.selectEmpresa[0] == null || this.selectEmpresa[0].nome_empresa == null){
      this.nomeEmpresa = null;
      return "nao encontrado";
    }else{
      if(this.selectEmpresa[0].nome_empresa !== null ){
        alert(this.selectEmpresa[0].nome_empresa)

        this.nomeEmpresa = this.selectEmpresa[0].nome_empresa;
        this.cnpjEmpresa = this.selectEmpresa[0].cnpj;
        this.emailEmpresa  = this.selectEmpresa[0].email;
        this.contatoEmpresa  = this.selectEmpresa[0].contato;
        this.emailUsuarioCriador = this.selectEmpresa[0].criador;
        this.codEmpresa = this.selectEmpresa[0].cod_unico;
        if( this.emailUsuarioCriador == this.emailUsuario ){
          this.posicaoUsuarioEmpr = "Administrador";
          this.isUsuarioCriador = true;
        }else{
          this.posicaoUsuarioEmpr = "Funcion??rio";
          this.isUsuarioCriador = false;
        }

        try {
          const docRef = await setDoc(doc(db, "usuarios", this.emailUsuario), {
            email: this.emailUsuario,
            nome: this.nomeUsuario,
            celular: this.celularUsuario,
            cpf: this.cpfUsuario,
            dt_nascimento: this.dataNascimentoUsuario,
            sexo: this.sexoUsuario,
            cod_empresa: this.codEmpresa,
            sts_ativo: true
          });
        } catch (e) {
          alert("Error adding document: "+ e);
        }
      }
      return this.selectEmpresa[0].nome_empresa;
    }
  }

  renderizarCamposEmpresa(){
    const gridEmpresa = document.getElementById("gridEmpresa");
    const listEmpresa = document.getElementById("listEmpresa");
    const salvarEmpresa = document.getElementById("salvarEmpresa");
    gridEmpresa.style.setProperty('visibility', 'visible');
    listEmpresa.style.setProperty('visibility', 'visible');
    salvarEmpresa.style.setProperty('visibility', 'visible');

  }

  async consultaEmpresaBanco(){
    this.retornoQueryConsultEmpresa = (await this.consultaEmpresaQuery("nome_empresa", this.consultaEmpresa)).toString();

    if(this.nomeEmpresa !== null){
      console.log("Empresa encontrada por nome! => "+ this.retornoQueryConsultEmpresa);
      this.renderizarCamposEmpresa();
      this.presentToastWithOptions("Dados atualizados com sucesso!", true);
  }else{
      console.log("Empresa n??o encontrada por nome!");
      this.retornoQueryConsultEmpresa = null;
      this.retornoQueryConsultEmpresa = this.consultaEmpresaQuery("cnpj", this.consultaEmpresa).toString();
      if(this.nomeEmpresa !== null){
        console.log("Empresa encontrada por cnpj! => "+ this.retornoQueryConsultEmpresa);
        this.renderizarCamposEmpresa();
        this.presentToastWithOptions("Dados atualizados com sucesso!", true);
      }else{
        console.log("Empresa n??o encontrada por cnpj!");
        this.retornoQueryConsultEmpresa = null;
        this.retornoQueryConsultEmpresa = this.consultaEmpresaQuery("cod_unico", this.consultaEmpresa).toString();

        if(this.nomeEmpresa != null){
          console.log("Empresa encontrada por C??digo ??nico! => "+ this.retornoQueryConsultEmpresa.toString());
          this.renderizarCamposEmpresa();
          this.presentToastWithOptions("Dados atualizados com sucesso!", true);
        }else{
          console.log("Empresa n??o encontrada por codigounico!");

          const alertt = await this.alertController.create({
            header: 'Empresa n??o encontrada. Cadastre uma agora!',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  this.sincDadosEmpresa = false;
                }
              }, 
              {
                  text: 'Continuar',
                  handler: (alertData) => { //takes the data 
                    this.nomeEmpresa = alertData.nomeEmpresa;
                    this.renderizarCamposEmpresa();
                    this.editarDadosEmpresa = true;
                    this.isCadastroNovaEmpresa = true;
                    this.btSalvarEditarEmpresa = "Criar Empresa";
                    this.isUsuarioCriador = true;

                  }
              }
            ],
            inputs: [
              {
                name: 'nomeEmpresa',
                placeholder: 'Nome da Empresa.',
                type: 'text'
              }
            ]
          });
      
          await alertt.present();

        }
      }
    }
  }
  // Fim Aba Empresa


  // Inicio Aba Dados
  async excluirDadosConta(){
    const alert = await this.alertController.create({
      header: 'Aten????o!\nVoc?? esta prestes a apagar todos os dados da sua conta, essa a????o ?? irrevers??vel. Deseja continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //this.sincDadosEmpresa = false;
          }
        }, 
        {
            text: 'Apagar Dados',
            handler: (alertData) => { //takes the data 
                // this.consultaEmpresa = alertData.dadoConsultaEmpresa;
                // this.consultaEmpresaBanco();
            }
        }
      ],
    });

    await alert.present();
  }
  // Fim Aba Dados


  // Inicio Aba Duvida
  async consultaDuvida(){
    const q = query(collection(db, "config_global_app"), where("type", "==", "Duvida"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.selectDuvidas[this.i] = doc.data();
      this.i ++;

    });
    console.log(this.selectDuvidas);

  }

  duvidaAtual = undefined;
  pegarDuvidaSelecionado(ev) {
    this.duvidaAtual  = ev.target.falha;
  }
  // Fim Aba Duvida




  // Inicio Aba Report Problem
  async consultaFalha(){
    const q = query(collection(db, "config_global_app"), where("type", "==", "Relatar Falha"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.selectReports[this.x] = doc.data();
      this.x ++;

    });
    console.log(this.selectReports);

  }

  falhaAtual = undefined;
  pegarReportSelecionado(ev) {
    this.falhaAtual  = ev.target.falha;
  }
  // Fim Aba Report Problem


}
