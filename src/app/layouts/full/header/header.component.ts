import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AppHeaderComponent implements OnInit {
usuario=localStorage.getItem("usuario");
  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit() {
    //var log=this.authenticationService.login(new LoginObject(this.loginForm.value));
  }

}
