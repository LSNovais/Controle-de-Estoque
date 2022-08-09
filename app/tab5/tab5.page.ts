import { Component, OnInit, Injectable, NgModule } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { EditImagePage } from '../edit-image/edit-image.page'

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult, signOut  } from "firebase/auth";

//firestore
import { doc, setDoc, getFirestore, query, where, limitToLast } from "firebase/firestore";
import { ActivatedRoute, Router } from '@angular/router';

//Local database
import { Storage } from '@ionic/storage-angular';

import { AlertController } from '@ionic/angular';
import { ModalController} from '@ionic/angular';  
import { ToastController } from '@ionic/angular';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { environment } from 'src/environments/environment';
import { AppModule } from '../app.module';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

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
  public urlFotoPerfil:string;
  public imagePerfil;

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
  public imageEmpresa;

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

  async fileChangeEvent(event: any): Promise<void> {
    
    let profileModal = this.modalCtrl.create({
      component: EditImagePage,
      componentProps: { img: event,
                        type: "perfil",
                        nome:  this.nomeUsuario}
    });
    // let profileModal = this.modalCtrl.create(EditImagePage, { userId: 8675309 });
    this.modalCtrl.dismiss();
    await (await profileModal).present();

    const { data, role } = await (await profileModal).onWillDismiss();
    if (role === 'alterarImage') {
      this.imagePerfil = data;
      try {
        const docRef = await setDoc(doc(db, "usuarios", this.emailUsuario), {
          email: this.emailUsuario,
          nome: this.nomeUsuario,
          celular: this.celularUsuario,
          cpf: this.cpfUsuario,
          dt_nascimento: this.dataNascimentoUsuario,
          sexo: this.sexoUsuario,
          cod_empresa: this.codEmpresa,
          img_perfil: this.imagePerfil,
          sts_ativo: true
        });
        this.modalCtrl.dismiss();
        this.presentToastWithOptions("Perfil atualizado com sucesso!", true);
        console.log("Document written with ID: ", docRef);
      } catch (e) {
        this.presentToastWithOptions("Falha ao atualizar perfil!", false);
        console.error("Error adding document: ", e);
      }
    }
  }

  async fileChangeEventEmpresa(event: any): Promise<void> {
    
    let profileModal = this.modalCtrl.create({
      component: EditImagePage,
      componentProps: { img: event,
                        type: "empresa",
                        nome:  this.nomeEmpresa}
    });
    // let profileModal = this.modalCtrl.create(EditImagePage, { userId: 8675309 });
    this.modalCtrl.dismiss();
    await (await profileModal).present();

    const { data, role } = await (await profileModal).onWillDismiss();
    if (role === 'alterarImage') {
      this.imageEmpresa = data;
      try {
        const docRef = await setDoc(doc(db, "empresas", this.nomeEmpresa), {
          email: this.emailEmpresa,
          nome_empresa: this.nomeEmpresa,
          contato: this.contatoEmpresa,
          cnpj: this.cnpjEmpresa,
          cod_unico: this.codEmpresa,
          criador: this.emailUsuario,
          img_empresa: this.imageEmpresa,
          sts_ativo: true
        });
        console.log("Document written with ID: ", docRef);
        this.presentToastWithOptions("Imagem da empresa atualizada!",true);
        this.btSalvarEditarEmpresa = "Editar Dados";
        this.editarDadosEmpresa = false;
        this.modalCtrl.dismiss();
      } catch (e) {
        console.error("Error adding document: ", e);
        this.presentToastWithOptions("Falha ao atualizar imagem da empresa!",false);
      }
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
    this.imagePerfil = this.selectPerfil[0].img_perfil;

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
        this.imageEmpresa  = this.selectEmpresa[0].img_empresa;
        this.emailUsuarioCriador = this.selectEmpresa[0].criador;
        if( this.emailUsuarioCriador == this.emailUsuario ){
          this.posicaoUsuarioEmpr = "Administrador";
          this.isUsuarioCriador = true;
        }else{
          this.posicaoUsuarioEmpr = "Funcionário";
          this.isUsuarioCriador = false;
        }
        this.sincDadosEmpresa = true;

        const gridEmpresa = document.getElementById("gridEmpresa");
        const listEmpresa = document.getElementById("listEmpresa");
        const salvarEmpresa = document.getElementById("salvarEmpresa");
        gridEmpresa.style.setProperty('visibility', 'visible');
        listEmpresa.style.setProperty('visibility', 'visible');
        salvarEmpresa.style.setProperty('visibility', 'visible');


        if( this.urlFotoPerfil !== null ){
          const img = document.getElementById('imgPerfilUsuario');
          img.setAttribute('src',this.urlFotoPerfil);
        } 


      }else{
        // alert("Empresa não encontrada!");
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
        cod_empresa: this.codEmpresa,
        img_perfil: this.imagePerfil,
        sts_ativo: true
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
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  
  async salvarEmpresa(){
    if(this.editarDadosEmpresa && this.isUsuarioCriador){
      if(this.isCadastroNovaEmpresa){
        this.codEmpresa = this.nomeEmpresa.replace(/ /g, "").toLowerCase()+"#"+this.getRandomIntInclusive(100,999).toString();
        try {
          const docRef = await setDoc(doc(db, "empresas", this.nomeEmpresa), {
            email: this.emailEmpresa,
            nome_empresa: this.nomeEmpresa,
            contato: this.contatoEmpresa,
            cnpj: this.cnpjEmpresa,
            cod_unico: this.codEmpresa,
            criador: this.emailUsuario,
            img_empresa: this.imageEmpresa,
            sts_ativo: true
          });
          this.salvarPerfil();
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
            img_empresa: this.imageEmpresa,
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
            placeholder: 'Nome, CNPJ ou Código Único.',
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
          img_perfil: this.imagePerfil,
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
      const iconCameraEmpresa = document.getElementById("iconCameraEmpresa");
      const badgeCameraEmpresa = document.getElementById("badgeCameraEmpresa");
      const imageEmpresa = document.getElementById("imageEmpresa");

      iconCameraEmpresa.style.setProperty('visibility', 'visible');
      badgeCameraEmpresa.style.setProperty('visibility', 'visible');
      imageEmpresa.style.setProperty('border-color', 'rgba(167, 167, 167, 0.5)');

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
        this.imageEmpresa  = this.selectEmpresa[0].img_empresa;
        this.emailUsuarioCriador = this.selectEmpresa[0].criador;
        this.codEmpresa = this.selectEmpresa[0].cod_unico;
        if( this.emailUsuarioCriador == this.emailUsuario ){
          this.posicaoUsuarioEmpr = "Administrador";
          this.isUsuarioCriador = true;
        }else{
          this.posicaoUsuarioEmpr = "Funcionário";
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
            img_perfil: this.imagePerfil,
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
      console.log("Empresa não encontrada por nome!");
      this.retornoQueryConsultEmpresa = null;
      this.retornoQueryConsultEmpresa = this.consultaEmpresaQuery("cnpj", this.consultaEmpresa).toString();
      if(this.nomeEmpresa !== null){
        console.log("Empresa encontrada por cnpj! => "+ this.retornoQueryConsultEmpresa);
        this.renderizarCamposEmpresa();
        this.presentToastWithOptions("Dados atualizados com sucesso!", true);
      }else{
        console.log("Empresa não encontrada por cnpj!");
        this.retornoQueryConsultEmpresa = null;
        this.retornoQueryConsultEmpresa = this.consultaEmpresaQuery("cod_unico", this.consultaEmpresa).toString();

        if(this.nomeEmpresa != null){
          console.log("Empresa encontrada por Código Único! => "+ this.retornoQueryConsultEmpresa.toString());
          this.renderizarCamposEmpresa();
          this.presentToastWithOptions("Dados atualizados com sucesso!", true);
        }else{
          console.log("Empresa não encontrada por codigounico!");

          const alertt = await this.alertController.create({
            header: 'Empresa não encontrada. Cadastre uma agora!',
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
      header: 'Atenção!\nVocê esta prestes a apagar todos os dados da sua conta, essa ação é irreversível. Deseja continuar?',
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
