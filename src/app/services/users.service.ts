import { Injectable } from '@angular/core';
import {User} from 'src/app/models/user.model'
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { URL_API } from "../../environments/environment";
const Backend_User_Url=URL_API+"user";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  user:User[]=[];
  userObs= new Subject<{user:User[]}>();

  constructor(private http: HttpClient, private router: Router) {}
  
  getUsers(){
    this.http.get<{mensaje:string;user:any}>(Backend_User_Url)
    .pipe(map(usersData=>{
      console.log(usersData);
     return{
      user: usersData.user.map(user=>{
        console.log(user);
          return{
            id:user.id,
            name: user.name,            
            email: user.email,
            idrol: user.idrol,
            created_at: user.created_at,
            updated_at: user.created_at
          };
        })
      };
    }))
    .subscribe(transformedUserData=>{
      this.user = transformedUserData.user;
      this.userObs.next({
        user: [...this.user]
      });
    });
  }

  getUsersListener(){
    return this.userObs.asObservable();
  }
}
