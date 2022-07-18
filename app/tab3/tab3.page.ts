import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController} from '@ionic/angular';  


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  providers: [ BarcodeScanner ],
  styleUrls: ['tab3.page.scss']
})

//Declaração da classe
export class Tab3Page{

  constructor(private barcodeScanner: BarcodeScanner, public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  scan(){
    this.barcodeScanner.scan().then((barcodeData)=>{
      alert("barcode data = "+barcodeData.text);
    },(err)=>{
      alert(JSON.stringify(err));
    })
  }
}