import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firebase:AngularFireDatabase) { 

  }
  // Update user profile information, pass the user id and user info as object
  updateUserInformation(uid:string,userInfo:object){
    return new Promise((resolve,reject) => {
     this.firebase.database.ref('users').child(uid).child('profile')
     .set(userInfo)
     .then(() => {
       resolve();
     }).catch((e) => {
      reject(e);
     });
    });
  }
  // Get user profile information by the user id 
  getUserInformation(uid:string){
    return new Promise((resolve,reject) => {
     this.firebase.database.ref('users').child(uid).child('profile')
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
    
    this.firebase.database.ref('users').child(uid).child('basket').child(item['id']).set(item)
    .then(() => {
      resolve();
    }).catch(() => {
      reject();
    })
    });
  }
  /*
   Get items in user basket by user id from firebase database using  valueChanges()
What is it? - Returns an Observable of data as a synchronized array of JSON objects. All Snapshot metadata is stripped and just the method provides only the data.

Why would you use it? - When you just need a list of data. No snapshot metadata is attached to the resulting array which makes it simple to render to a view.
   */
  getItemsInBasket(uid:string){
 return this.firebase.list('users/'+uid+'/basket').valueChanges()
  }
    /*
   Get all user orders by user id from firebase database using  valueChanges()
What is it? - Returns an Observable of data as a synchronized array of JSON objects. All Snapshot metadata is stripped and just the method provides only the data.

Why would you use it? - When you just need a list of data. No snapshot metadata is attached to the resulting array which makes it simple to render to a view.
   */
  getUserOrders(uid:string){
    return this.firebase.list('back-office/orders',ref => ref.orderByChild('customerId').startAt(uid).endAt(uid)).valueChanges();
  }
  // Remove item from basket by user id and item id 
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
  // Clear user basket by deleting all current user basket items from database
  clearUserBasket(uid:string){
    return new Promise((resolve,reject) => {
      this.firebase.list('users/'+uid+'/basket').remove()
      .then(() => {
         resolve();
      }).catch(() => {
        reject();
      })
    });
  }
  getPushId(){
    return this.firebase.createPushId();
  }
}
