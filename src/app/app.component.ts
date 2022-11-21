import { Component } from '@angular/core';
import {ViewService} from "./view.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cole-enyart-capstone-fe-follower';
  viewProcessList: boolean = true;
  viewProcess: boolean = false;


  constructor(private viewService: ViewService) {
    this.viewService.$viewProcessList.pipe().subscribe({
      next: (viewProcessList) => {
        this.viewProcessList = viewProcessList;
      },
      error: () => {
      }
    })

    this.viewService.$viewProcess.pipe().subscribe({
      next: (viewProcess) => {
        this.viewProcess = viewProcess;
      },
      error: () => {
      }
    })
  }
}
