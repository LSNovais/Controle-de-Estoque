import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.page.html',
  styleUrls: ['./edit-image.page.scss'],
})
export class EditImagePage implements OnInit {
  @ViewChild("uploader", {static: true}) uploader: ElementRef<HTMLInputElement>;
  public imgRouteEdit;
  croppedImage: any = '';
  imageChangedEvent: any = '';
  imageType: string = '';
  tituloPage: string = '';
  tituloHistorico: string = '';
  nome: string = '';



  constructor(private route: ActivatedRoute, private navParams: NavParams, public modalCtrl: ModalController) {
    this.imageChangedEvent = navParams.get('img');
    this.imageType = navParams.get('type');
    this.tituloHistorico = navParams.get('nome');

    if(this.imageType === "perfil"){
      this.tituloPage = "Editar Imagem de Perfil";
    }else{
      this.tituloPage = "Editar Imagem da Empresa";
    }
   }

   
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  salvarImage(){
    this.modalCtrl.dismiss(this.croppedImage, 'alterarImage');
  }

  cancelarFoto(){
    this.modalCtrl.dismiss(null, 'cancelarTrocaFoto');
  }

  alterarFoto(): void {
    this.uploader.nativeElement.click();
  }

  ngOnInit() {
  }

}
