import { Component, HostListener, OnInit } from '@angular/core';
import { Board } from '../../models/board.model';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit{
  boards!: Board[];
  username!: string;
  constructor(private taskService: TaskService) {}

  ngOnInit() { 
    this.taskService.getBoards().subscribe(next => {
      this.boards = next as Board[];

    })
    
  }
  
}
