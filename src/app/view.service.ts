import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  public $viewProcessList = new BehaviorSubject<boolean>(true);
  public $viewProcess = new BehaviorSubject<boolean>(false);

  constructor() { }

  public viewProcessList() {
    this.viewCloseAll();
    this.$viewProcessList.next(true);
  }

  public viewProcess() {
    this.viewCloseAll();
    this.$viewProcess.next(true);
  }

  public viewCloseAll() {
    this.$viewProcessList.next(false);
    this.$viewProcess.next(false);
  }
}
