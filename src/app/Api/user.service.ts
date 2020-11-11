import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firebase:AngularFireDatabase) { 

  }
  updateUserInformation(uid:string,userInfo:object){
    return new Promise((resolve,reject) => {
     this.firebase.database.ref('users').child(uid)
     .set(userInfo)
     .then(() => {
       resolve();
     }).catch((e) => {
      reject(e);
     });
    });
  }
  getUserInformation(uid:string){
    return new Promise((resolve,reject) => {
     this.firebase.database.ref('users').child(uid)
     .once('value', (userInfo) => {
       resolve(userInfo.val());
     }).catch((e) => {
       reject(e);
     })
    });
  }
}
