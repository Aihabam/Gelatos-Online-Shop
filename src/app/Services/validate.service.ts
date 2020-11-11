import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() {



  }
  static isEmpty(str) {
    return !str.replace(/\s/g, '').length;
  }
  static isValidEmail(mail) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(mail).toLowerCase());
  }

  static hasNumber(string) {
    return string.match(/\d+/g);
  }

  static isLong(string){
   return string < 20;
  }
  static isNumbers(str){
    return  /^\d+$/.test(str);
  }

}