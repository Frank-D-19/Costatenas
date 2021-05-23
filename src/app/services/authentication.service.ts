import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { map } from "rxjs/operators"
import {LoginObject} from "../auth/login/shared/login-object.model";
import {UsersService} from 'src/app/services/users.service';
import {User} from 'src/app/models/user.model';
import {Session} from "src/app/models/session.model";
import { URL_API } from "../../environments/environment";



@Injectable()
export class AuthenticationService {
  
   headers: HttpHeaders;
 constructor(private http: HttpClient,private userService: UsersService) {
 this.headers=new HttpHeaders({"Accept":"aplication/json","Athorization":""});
 }
 users: User[]=[];

 /*iniciar(){
  return this.http.get<any>(Backend_User_Url,{headers:this.headers}).pipe(map(
     datos=>{
      console.log(datos)
        return datos;
     }
  ))
 }*/

login(loginObj: LoginObject) {
      if((loginObj['username']=="admin" || loginObj['username']=="eduardo") && loginObj['password']=="123"){
           console.log('1')
         return true
         }else
            {  console.log('2')
               return false   
    }
   
 }
/* logout(): Observable<Boolean> {
 return this.http.post(this.basePath + 'logout', {}).map(this.extractData);
 }
 private extractData(res: Response) {
 let body = res.json();
 return body;
 }*/
}