import { Injectable } from '@angular/core';
import {BehaviorSubject, first} from "rxjs";
import {IProcess} from "./_interfaces/IProcess";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  $processList = new BehaviorSubject<IProcess[]>([]);

  constructor(private httpService: HttpService) {
    this.getAllProcesses();
  }

  public getAllProcesses() {
    this.httpService.getAllProcesses().pipe(first()).subscribe({
      next: (processList) => {
        this.$processList.next(processList);
      },
      error: () => {
      }
    })
  }

  selectProcess(processId: number) {

  }
}
