import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ViewService} from "../view.service";
import {ProcessService} from "../process.service";
import {IProcess} from "../_interfaces/IProcess";

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.css']
})
export class ProcessListComponent implements OnDestroy {

  processList: IProcess[] = [];
  onDestroy = new Subject();

  constructor(private processService: ProcessService, private viewService: ViewService) {
    this.processService.$processList.pipe(takeUntil(this.onDestroy)).subscribe({
      next: (processList) => {
        if (processList) {
          this.processList = processList;
        }
      },
      error: () => {}
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onViewProcess(processId: number) {
    this.viewService.viewProcess();
    this.processService.selectProcess(processId);
  }

}
