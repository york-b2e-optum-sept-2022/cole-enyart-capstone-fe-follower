import {Injectable} from '@angular/core';
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
  finishedProcess: IFinishedProcess = {
    title: "",
    finishedStages: []
  };
  choice: { text: string, "value": string }[] = [];
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
        for (let process of processList) {
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
    this.$last.next(false);
    this.finishedProcess.title = title;

    this.httpService.saveProcess(this.finishedProcess).pipe(first()).subscribe({
      next: () => {
        this.viewService.viewProcessList();
        this.getAllProcesses();
        this.finishedProcess = {
          title: "",
          finishedStages: []
        };
        this.choice = [];
      },
      error: () => {
      }
    })
  }

  onNext(answer: string) {
    this.$processError.next("");
    if (this.$index.getValue() === this.$process.getValue().stages.length - 1) {
      this.$last.next(true);
    }

    if (answer === "") {
      this.$processError.next(this.NO_INPUT_ERROR);
      return;
    }

    console.log(this.$index.getValue(), this.$process.getValue().stages.length)

    if (this.$index.getValue() + 1 < this.$process.getValue().stages.length) {
      this.$last.next(false);
      this.$index.next(this.$index.getValue() + 1);
    }

    this.addAnswer(answer);
  }

  addAnswer(answer: string) {
    const prompt = this.$process.getValue().stages[this.$index.getValue()].prompt;
    // const finishedChoices = this.choice.filter((choice) => choice.value === "true");
    // console.log(finishedChoices);
    const stage = {
      prompt: prompt,
      answer: answer,
      finishedChoices: this.choice
    }

    this.finishedProcess.finishedStages.push(stage);
  }

  addChoice(text: string, value: string) {
    const choice = {text: text, value: value};
    this.choice.push(choice);
    console.log(this.choice);
  }

}
