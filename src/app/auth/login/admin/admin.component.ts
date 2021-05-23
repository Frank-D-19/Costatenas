import { Component, OnInit, Input } from '@angular/core';
import {User} from 'src/app/models/user.model';
import {UsersService} from '../../../services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
users: User[]=[];
userSub:Subscription;
  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.userService.getUsers();
    this.userSub= this.userService.getUsersListener()
    .subscribe((usersData:{user: User[]})=>{
      this.users = usersData.user;
    });
  }

}
