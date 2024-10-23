import { Component, HostListener, OnInit } from '@angular/core';
import { Board } from '../../models/board.model';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit{
  boards: Board[] = [];
  username!: string;
  filteredBoards: Board[] = []; // Array to hold the search results
  constructor(private taskService: TaskService) {}

  ngOnInit() { 
    this.taskService.getBoards().subscribe(next => {
      this.boards = next as Board[];
      this.filteredBoards = this.boards; // Initially, display all boards

    })
    
  }

  // Search function to filter projects based on the search query
  onSearch(event: any) {
    const searchText = event.target.value.toLowerCase();
    if (searchText) {
      // Filter boards based on the search text matching the project (board) title
      this.filteredBoards = this.boards.filter(board =>
        board.title.toLowerCase().includes(searchText)
      );
    } else {
      // If no search text, show all boards
      this.filteredBoards = this.boards;
    }
  }
  
}
