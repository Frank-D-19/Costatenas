import { Component, OnInit } from '@angular/core';
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthenticationService} from 'src/app/services/authentication.service';
import {LoginObject} from 'src/app/auth/login/shared/login-object.model';
import {Session} from "src/app/models/session.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public submitted: Boolean = false;
  public error: {code: number, message: string} = null;
  mensaje:string;
  constructor(private formBuilder: FormBuilder,           
              private router: Router,private authenticationService:AuthenticationService
              ) { }

  ngOnInit() {
       this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  public submitLogin(){

    if(this.loginForm.valid){
      var log=this.authenticationService.login(new LoginObject(this.loginForm.value));
      if(log==true){
       var datos =this.loginForm.controls.username.value
        localStorage.setItem("usuario", JSON.stringify(datos))
      this.router.navigate(['/indicadores']);
     }else{ 
     this.mensaje="Datos Incorrectos"
    }
  }
 }
}
