import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  save(key : any, data : any) {
    // sessionStorage.setItem(key, this.getSettable(data));
    sessionStorage.setItem(key, data);
  }

  read(key : any) {
    const value = sessionStorage.getItem(key);
    // return this.getGettable(value);
    return value;
  }

  remove(key : any) {
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }

}
