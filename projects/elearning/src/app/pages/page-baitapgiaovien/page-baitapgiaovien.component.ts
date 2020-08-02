import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
@Component({
  selector: 'app-page-baitapgiaovien',
  templateUrl: './page-baitapgiaovien.component.html',
  styleUrls: ['./page-baitapgiaovien.component.css']
})
export class PageBaitapgiaovienComponent implements OnInit {
  task: Task = {
    name: 'Tất cả học viên',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Huy Nguyễn', completed: false, color: 'primary'},
      {name: 'Tốt địt', completed: false, color: 'accent'},
      {name: 'Văn thịnh', completed: false, color: 'warn'}
    ]
  };
  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
