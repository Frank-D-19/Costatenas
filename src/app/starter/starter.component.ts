import { Component, AfterViewInit,OnInit } from '@angular/core';
import { Chart } from '../../../node_modules/chart.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})

export class StarterComponent{
 

  constructor(private toastr: ToastrService) {

  }
  showToaster(){
    this.toastr.success("Hello, I'm the toastr message.",null,{
  
    })
}

  ngOnInit() {

  }
  /*showToast=()=>{
    this.toastRef = this.toastr.show("Test",null,{
      disableTimeOut: true,
      tapToDismiss: false,
      toastClass: "toast border-red",
      closeButton: true,
      positionClass:'bottom-left'
    });
  }*/

}

