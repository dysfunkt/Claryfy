import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { Router } from '@angular/router';
import { Board } from '../../models/board.model';
import { AuthService } from '../../auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent implements OnInit{

  constructor(private taskService: TaskService, private router: Router, private authService: AuthService) {  }
  username!: string;
  ngOnInit() { 
    
    this.authService.getUsername().subscribe(next => {
      this.username = (next as User).username
    })
  }

  createProject(title: string) {
    this.taskService.createBoard(title).subscribe(next => {
      const board: Board = next as Board;
      console.log(board);
      this.initColumns(board._id)
      //change this to /kanban-view/board._id
      this.router.navigate(['/project-list'])
    });
  }
  
  initColumns(boardId: string) {
    this.taskService.createColumn(boardId, "To Do", 0).subscribe(() => {});
    this.taskService.createColumn(boardId, "In Progress", 1).subscribe(() => {});
    this.taskService.createColumn(boardId, "Needs Review", 2).subscribe(() => {});
    this.taskService.createColumn(boardId, "Completed", 3).subscribe(() => {});
  }

  logout() {
    this.authService.logout()
  }
}
