import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, sendPasswordResetEmail  } from "firebase/auth";

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
})
export class RecuperarSenhaPage implements OnInit {
  public emailRecuperarSenha:string;

  constructor(public router: Router) { }

  ngOnInit() {
  }

  btRecuperarSenha(){
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.emailRecuperarSenha)
    .then(() => {
      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }

  btVoltar(){
    this.router.navigate(['/login']);
  }
}
