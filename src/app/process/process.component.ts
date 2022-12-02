import {Component, OnInit, OnDestroy} from '@angular/core';
import {IProcess} from "../_interfaces/IProcess";
import {Subject, takeUntil} from "rxjs";
import {ProcessService} from "../process.service";
import {ViewService} from "../view.service";

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit, OnDestroy {

  process!: IProcess;
  index!: number;
  last!: boolean;
  errorMessage: string = "";
  onDestroy = new Subject();

  constructor(private processService: ProcessService, private viewService: ViewService) {
    this.processService.$process.pipe(takeUntil(this.onDestroy)).subscribe({
      next: (process) => {
        this.process = process;
      },
      error: () => {
      }
    })

    this.processService.$index.pipe(takeUntil(this.onDestroy)).subscribe( {
      next: (index) => {
        this.index = index;
      },
      error: () => {
      }
    });

    this.processService.$last.pipe(takeUntil(this.onDestroy)).subscribe( {
      next: (last) => {
        this.last = last;
      },
      error: () => {
      }
    });

    this.processService.$processError.pipe(takeUntil(this.onDestroy)).subscribe( {
      next: (errorMessage) => {
        this.errorMessage = errorMessage;
      },
        error: () => {
      }
    });
  }

  ngOnInit() {
    this.onNext("");
    this.processService.$index.next(0);
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onCancel() {
    this.viewService.viewProcessList();
    this.processService.getAllProcesses();
    this.processService.finishedProcess = {
      title: "",
      finishedStages: []
    };
    this.processService.choice = [];
  }

  onSave(value: string) {
    const title = this.process.title
    this.processService.saveProcess(value, title);
  }

  onNext(value: string) {
    this.processService.onNext(value);
  }

  handleChange(event: any, text: string) {
    this.processService.addChoice(text, event);
  }
}
