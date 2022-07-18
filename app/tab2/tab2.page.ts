import { Component, Injectable, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';
import { ModalController} from '@ionic/angular';  
import { ProdutosPage } from '../produtos/produtos.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
@NgModule({
  imports: [
    IonicStorageModule.forRoot()
  ]
})
@Injectable({
  providedIn: 'root'
})
export class Tab2Page {


  // Typically referenced to your ion-router-outlet
  presentingElement = null;
  dataRoute: any;
  public isTab2:boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private storage: Storage, public modalCtrl: ModalController){
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


  async consultarProduto(){
    this.modalCtrl.dismiss();
    this.isTab2 = false;
    const modalPageProduto = await this.modalCtrl.create({
      component: ProdutosPage
    });
    return await modalPageProduto.present();

  }
  
}
