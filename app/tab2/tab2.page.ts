import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  providers: [ BarcodeScanner ],
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private barcodeScanner: BarcodeScanner) { }

  scan(){
    this.barcodeScanner.scan().then((barcodeData)=>{
      alert("barcode data = "+barcodeData.text);
    },(err)=>{
      alert(JSON.stringify(err));
    })
  }

}
