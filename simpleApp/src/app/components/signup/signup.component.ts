import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SignUp } from 'src/app/shared/signup';
import {DataService} from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm : FormGroup;
  signUp :SignUp;
  users : SignUp[] = [];
  user : SignUp;

  @ViewChild("fform") signUpFormDirective; // To reset the form


  constructor(private fb: FormBuilder,private dataService:DataService,private toastr: ToastrService,private route:Router) { 
    this.createForm();
  }

  
  ngOnInit() {
    this.getDatafromAPI();
    console.log(this.users);
  }

  signUpErrors = {
    firstName:"",
    middleName:"",
    lastName:"",
    phonenum:"",
    email:"",
    password:""
  }

  validationMessages = {
    firstName: {
      required: "First Name is required.",
      minlength: "First name must be atleast 2 characters long",
      maxlength: "First name cannot be more than 25 characters long",
    },
    middleName: {
      required: "Middle name is required.",
      minlength: "Middle name must be atleast 2 characters long",
      maxlength: "Middle name cannot be more than 25 characters long",
    },
    lastName: {
      required: "Last name is required.",
      minlength: "Last name must be atleast 2 characters long",
      maxlength: "Last name cannot be more than 25 characters long",
    },
    phonenum: {
      required: "Phone number is required",
      pattern: "Phone number must contains only numbers",
    },
    email: {
      required: "Email is required",
      email: "Email is not in valid format",
    },
    password:{
      required:"Password is required"
    }
  }
  createForm(){
    this.signUpForm = this.fb.group({
      firstName:["",[
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      lastName:["",[
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      middleName:["",[
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      phonenum:["",[Validators.required,Validators.pattern]],
      email:["",[Validators.required,Validators.email]],
      password:["",Validators.required]
    });

    this.signUpForm.valueChanges.subscribe((data) => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?:any){
    if(!this.signUpForm)
      return;
    const form = this.signUpForm;
    for(const field in this.signUpErrors){
      if(this.signUpErrors.hasOwnProperty(field)){
        this.signUpErrors[field] = "";
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.signUpErrors[field]+=messages[key] + " ";
            }
          }
        }
      }
    }  
  }

  onSubmit(){
    console.log("Form data submitted")
    this.signUp = this.signUpForm.value;
    this.dataService.sendData(this.signUp).subscribe((res) => {
      console.log(res);
      let msg = res['msg'];
      if(msg === "Successfully added User"){
        this.route.navigateByUrl('/');
      }
    });
    this.showSuccess();
    this.signUpForm.reset({
      firstName:"",
      middleName:"",
      lastName:"",
      phonenum:"",
      email:"",
      password:""
    });
    this.signUpFormDirective.resetForm();
  }

  getDatafromAPI(){
    this.dataService.getData().subscribe((response)=>{
        response.forEach(value => this.users.push(value));
      }, ((error) =>{
        console.log("error is", error)
      } )
    )
  }


  showSuccess() {
    this.toastr.success('User Added', 'Success!',{
      timeOut:3000,
      progressBar:true,
      progressAnimation:'increasing'
    });
  }

}
