import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import {Login} from 'src/app/shared/login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm : FormGroup;
  login : Login;

  constructor(private route: Router,private fb:FormBuilder,private dataService:DataService, private toastr: ToastrService) {
    this.createLoginForm();
   }

  ngOnInit() {
  }

  createLoginForm(){
    this.loginForm = this.fb.group({
      email:"",
      password:""
    })
  }


  submit(){
    this.login = this.loginForm.value;
    this.dataService.checkUser(this.login).subscribe((res) => {
      const msg = res['msg'];
      if(msg === 'user not existed'){
        this.showErrorMessage();
        this.route.navigateByUrl('/signup');
      }
      else if(msg === 'User existed password correct'){
        this.showSuccessMessage();
        this.route.navigateByUrl('/food');
      }
      else if(msg === 'Password Wrong')
        this.showWarningMessage();
    })
  }
  
  goToHome(){
    this.route.navigateByUrl('/');
  }

  // Toastr messages functions

  showWarningMessage() {
    this.toastr.warning('Try again','Invalid Password',{
      timeOut:3000,
      progressBar: true,
      progressAnimation : 'increasing',
    });
  }

  showErrorMessage() {
    this.toastr.error('User not existed','Invalid User',{
      timeOut:3000,
      progressBar: true,
      progressAnimation : 'increasing',
    });
  }

  showSuccessMessage() {
    this.toastr.success('Successfully Logged in','User login',{
      timeOut:3000,
      progressBar: true,
      progressAnimation : 'increasing',
    });
  }

}
