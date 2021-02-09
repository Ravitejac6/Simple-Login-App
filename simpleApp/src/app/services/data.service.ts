import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable,throwError } from 'rxjs';
import { SignUp } from '../shared/signup';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  postData: Observable<any>;
  users: Object;

  constructor(private http:HttpClient) { }

  getData(){
    return this.http.get<SignUp[]>('http://localhost:3000/api/getData');
  }

  sendData(data){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'my-auth-token'
      })
    };
    console.log("Sending the data to the DB");
    console.log(data);
     return this.http.post('http://localhost:3000/api/user',data,httpOptions)
     .pipe(
      catchError((err) => {
        console.log(err)
        return throwError(
          'Something bad happened; please try again later.');
      
      })
    );
  }

  checkUser(data){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'my-auth-token'
      })
    };
    return this.http.post('http://localhost:3000/api/login',data,httpOptions);
  }

}
