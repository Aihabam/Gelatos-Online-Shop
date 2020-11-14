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
  // Get user 
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
  // Add item to user basket using their Id and the item data
  addToUserBasket(uid:string,item:object){
    return new Promise((resolve,reject) => {
      let id = this.firebase.database.ref().push().key
      item['id'] = id;
    this.firebase.database.ref('users').child(uid).child('basket').child(id).set(item)
    .then(() => {
      resolve();
    }).catch(() => {
      reject();
    })
    });
  }
  getItemsInBasket(uid:string){
 return this.firebase.list('users/'+uid+'/basket').valueChanges()
  }
 
  removeItemFromBasket(uid:string,key:any){
    return new Promise((resolve,reject) => {
      this.firebase.list('users/'+uid+'/basket/'+[key]).remove()
      .then(() => {
         resolve();
      }).catch(() => {
        reject();
      })
    });

  }
}
