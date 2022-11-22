import { Injectable } from '@angular/core';
import {BehaviorSubject, first} from "rxjs";
import {IProcess} from "./_interfaces/IProcess";
import {HttpService} from "./http.service";
import {IFinishedProcess} from "./_interfaces/IFinishedProcess";
import {ViewService} from "./view.service";

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  $processList = new BehaviorSubject<IProcess[]>([]);
  $process = new BehaviorSubject<IProcess>({
    id: 0,
    title: "",
    stages: [{id: 0, prompt: "", type: "", choices: []}]
  });
  $finishedProcess = new BehaviorSubject<IFinishedProcess>({
    title: "",
    finishedStages: []
  });
  $index = new BehaviorSubject<number>(0);
  $last = new BehaviorSubject<boolean>(false);
  $processError = new BehaviorSubject<string>("");

  private NO_INPUT_ERROR = "Answer needed to continue";

  constructor(private httpService: HttpService, private viewService: ViewService) {
    this.getAllProcesses();
  }

  public getAllProcesses() {
    this.httpService.getAllProcesses().pipe(first()).subscribe({
      next: (processList) => {
        for(let process of processList) {
          process.stages?.sort((a, b) => (a.id > b.id ? 1 : -1))
        }

        this.$processList.next(processList);
      },
      error: () => {
      }
    })
  }

  selectProcess(processId: number) {
    for (let process of this.$processList.getValue()) {
      if (process.id === processId) {
        this.$process.next(process);
      }
    }
  }

  saveProcess(value: string, title: string) {
    if (value === "") {
      this.$processError.next(this.NO_INPUT_ERROR);
      return;
    }
    this.addAnswer(value);
    this.$finishedProcess.getValue().title = title;

    this.httpService.saveProcess(this.$finishedProcess.getValue()).pipe(first()).subscribe({
      next: () => {
        this.getAllProcesses();
        this.viewService.viewProcessList();
      },
      error: () => {
      }
    })
  }

  onNext(value: string) {
    this.$processError.next("");
    if (value === "") {
      this.$processError.next(this.NO_INPUT_ERROR);
      return;
    }
    this.addAnswer(value);
    if (this.$index.getValue() + 2 < this.$process.getValue().stages.length) {
      this.$last.next(false);
      this.$index.next(+ 1);
    } else {
      this.$last.next(true);
      this.$index.next(+ 1);
    }
  }

  addAnswer(value: string) {
    if (value !== "") {
      const question = this.$process.getValue().stages[this.$index.getValue()].prompt
      const arr = {
        prompt: question, answer: value
      }

      this.$finishedProcess.getValue().finishedStages.push(arr);
    }
  }
}
