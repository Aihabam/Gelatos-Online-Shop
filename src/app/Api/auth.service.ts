import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor( private firebase:AngularFireAuth) { 

  }
  // Get current user information
  getUser(){
    return new Promise((resolve,reject) => {
     this.firebase.onAuthStateChanged((user) => resolve(user), (error) => reject(error));
    });
  }
  // Login user with email and password
  doLogin(email:string,password:string){
  return new Promise((resolve,reject) => {
  this.firebase.signInWithEmailAndPassword(email,password)
  .then((res) => {
    resolve(res);
  }).catch((error) => {
    if (error.code === "auth/user-not-found"){
      reject("The email address you entered does not exist.");
     }else if (error.code === "auth/wrong-password"){
      reject("You have entered the wrong password");
     }else {
      reject("Something went wrong, please try again later.")
     }
  }); 
  });
  }
  // Create new user account with email and password
  createUserAccount(email:string,password:string){
   return new Promise((resolve,reject) => {
    this.firebase.createUserWithEmailAndPassword(email,password)
    .then((res) => {
       resolve(res)
    }).catch((error) => {
      if (error.code === "auth/email-already-in-use"){
        reject('The email address is in use by another account');
      }
       else if (error.code === "auth/weak-password"){
        reject('Password must be at least 6 characters long.')
      }else{
        reject('Something went wrong, please try again later.')
      }
    });
   });
  }
  // Send reset password email
  sendResetPasswordLink(email:string){
   return new Promise((resolve,reject) => {
    this.firebase.sendPasswordResetEmail(email)
    .then((res) => {
      resolve(res);
    }).catch((error) => {
      if (error.code === "auth/user-not-found"){
        reject("The email address you entered does not exist.");
       }else{
         reject('Something went wrong, please try again later.')
       }
    });
   });
  }
  signOutUser(){
  return new Promise((resolve,reject) => {
    this.firebase.signOut()
    .then(() => {  
     resolve();
    }).catch((error) => {
     reject(error);
    });
  });
  }
}
