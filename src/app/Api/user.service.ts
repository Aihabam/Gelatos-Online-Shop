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
  addToUserBasket(uid:string,item:object){
    return new Promise((resolve,reject) => {
    this.firebase.database.ref('users').child(uid).child('basket').push().set(item)
    .then(() => {
      resolve();
    }).catch(() => {
      reject();
    })
    });
  }
  getItemsInBasket(uid:string){
  return this.firebase.list('users/'+uid+'/basket').valueChanges();
  }
  removeItemFromBasket(uid:string,item:any){
   this.firebase.list('users/'+uid+'/basket/'+[item]).remove()
   .then(() => {
     
   })
  }
}
