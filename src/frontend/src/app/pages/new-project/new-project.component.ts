import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { Router } from '@angular/router';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent implements OnInit{

  constructor(private taskService: TaskService, private router: Router) {  }
  ngOnInit() { 
  
  }

  createProject(title: string) {
    if (title === '') {
      const titleDialog : HTMLDialogElement = document.getElementById('titleError') as HTMLDialogElement;
      titleDialog.show();
    }
    else {
      this.taskService.createBoard(title).subscribe(next => {
      const board: Board = next as Board;
      console.log(board);
      this.initColumns(board._id)
      //change this to /kanban-view/board._id
      this.router.navigate(['/project-list'])
      });
    }
    
  }
  
  initColumns(boardId: string) {
    this.taskService.createColumn(boardId, "To Do", 0).subscribe(() => {});
    this.taskService.createColumn(boardId, "In Progress", 1).subscribe(() => {});
    this.taskService.createColumn(boardId, "Needs Review", 2).subscribe(() => {});
    this.taskService.createColumn(boardId, "Completed", 3).subscribe(() => {});
  }

  close() {
    const titleDialog : HTMLDialogElement = document.getElementById('titleError') as HTMLDialogElement;
  
    titleDialog.close();
    
  }

}
