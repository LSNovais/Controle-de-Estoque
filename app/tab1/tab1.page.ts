import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { TabsPage } from '../tabs/tabs.page';
import { IonSlides} from '@ionic/angular';
import { ModalController} from '@ionic/angular';  

//Graficos
import Chart from 'chart.js/auto';

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs } from 'firebase/firestore/lite';

//Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, getRedirectResult, signOut  } from "firebase/auth";

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


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
//Declaração da classe
export class Tab1Page implements AfterViewInit{
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  public nomeUsuario:string;
  public emailUsuario:string;
  public cpfUsuario:string;
  public sexoUsuario:string;
  public dataNascimentoUsuario:string;
  public celularUsuario:number;
  public posicaoUsuarioEmpr:string;

  public codEmpresa:string;
  public produtosCadastrados:number;

  public selectReports = [];
  public selectDuvidas = [];
  public selectPerfil = [];

  public i = 0;
  public x = 0;
  
  lineChart: any;

  constructor(public modalCtrl: ModalController) { }

  ngAfterViewInit() {
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
    this.produtosCadastrados = 0;

    //Empresa
    if( this.codEmpresa !== null ){
      const qu = query(collection(db, "produtos"), where("cod_unico", "==", this.codEmpresa));
  
      const querySnapshotQu = await getDocs(qu);
      querySnapshotQu.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if(doc.data()[this.produtosCadastrados] !== null){
          this.produtosCadastrados++;
        }
      });
    }else{
      const qu = query(collection(db, "produtos"), where("cod_unico", "==", this.emailUsuario));
  
      const querySnapshotQu = await getDocs(qu);
      querySnapshotQu.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if(doc.data()[this.produtosCadastrados] !== null){
          this.produtosCadastrados++;
        }
      });
    }
    this.lineChartMethod();
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [
          {
            label: 'Vendas por mês',
            fill: false,
            //lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            spanGaps: false,
          },
          {
            label: 'Produtos adquiridos por mês',
            fill: false,
            //lineTension: 0.1,
            backgroundColor: 'red',
            borderColor: 'red',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'black',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 0, 0, 0, 0, this.produtosCadastrados, 0, 0, 0, 0, 0],
            spanGaps: false,
          }
        ]
      }
    });
  }
}