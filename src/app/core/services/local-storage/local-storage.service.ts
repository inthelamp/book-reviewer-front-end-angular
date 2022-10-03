import { Inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class LocalStorageService {

  constructor() {}

  public saveData(key: string, value: string, secretKey: string) {
    localStorage.setItem(key, this.encrypt(value, secretKey));
  }

  public getData(key: string, secretKey: string) {
    let encryptedData = localStorage.getItem(key)|| "";
    return this.decrypt(encryptedData, secretKey);
  }
  
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(data: string, secretKey: string): string {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  }

  private decrypt(encryptedData: string, secretKey: string) {
    return CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
  }
}
