import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private navCon:NavController) { }

  ngOnInit() {
  }
  // Shop now, choose now, and see all clicked navigate to shop page 
  goToShop(){
    this.navCon.navigateRoot('/tabs/shop');
  }

}
