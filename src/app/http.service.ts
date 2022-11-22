import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IProcess} from "./_interfaces/IProcess";
import {IFinishedProcess} from "./_interfaces/IFinishedProcess";

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

  public saveProcess(process: IFinishedProcess): Observable<IFinishedProcess> {
    return this.httpClient.post(
      "http://localhost:8080/api/process/finished", process
    ) as Observable<IFinishedProcess>
  }
}
