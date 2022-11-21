import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IProcess} from "./_interfaces/IProcess";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  public getAllProcesses(): Observable<IProcess[]> {
    return this.httpClient.get(
      "http://localhost:8080/api/process"
    ) as Observable<IProcess[]>
  }
}
