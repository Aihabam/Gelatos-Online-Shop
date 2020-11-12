import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  constructor(private dataBase:AngularFireDatabase) {

   }
   getProducts(){
      return this.dataBase.list('products').valueChanges();
   }
}
