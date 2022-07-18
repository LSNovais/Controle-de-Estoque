import { Component } from '@angular/core';

//Firebase Login
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastController } from '@ionic/angular';


const auth = getAuth();

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public toastController: ToastController) {
    onAuthStateChanged( auth, (user) => {
      if(user){
        const uid = user.uid;
        this.presentToastWithOptions("Usuário logado com sucesso!");
      }else{
        this.presentToastWithOptions("Usuário deslogado com sucesso!");
      }
    })
  }


    async presentToastWithOptions(message:string) {
      const toast = await this.toastController.create({
        // header: 'Toast header',
        message: message,
        icon: 'information-circle',
        position: 'top',
        duration: 2000
      });
      await toast.present();
  
    }

}

function presentToast(arg0: string) {
  throw new Error('Function not implemented.');
}

