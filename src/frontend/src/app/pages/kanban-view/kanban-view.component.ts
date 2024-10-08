import { Component, HostListener, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Board } from '../../models/board.model';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Column } from '../../models/column.model';
import { TaskCard } from '../../models/taskcard.model';
import { formatDate } from '@angular/common';
import { AuthService } from '../../auth.service';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-kanban-view',
  templateUrl: './kanban-view.component.html',
  styleUrl: './kanban-view.component.scss'
})
export class KanbanViewComponent implements OnInit{

  board!: Board;
  username!: string;
  isActive: Boolean = false;

  extractedText: string = ''; // Initialize extractedText as an empty string

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService, private http:HttpClient) {}

  ngOnInit() { 
    this.route.params.subscribe(
      (params: Params) => {
        if (params['boardId'] != undefined) {
          this.taskService.getBoard(params['boardId']).subscribe(next => {
            this.board = next as Board;
            this.columnInit(params['boardId']);
          })
        }
    });
    this.authService.getUsername().subscribe(next => {
      this.username = (next as User).username
    })
  }
  columnInit(boardId:string) {
    this.taskService.getColumns(boardId).subscribe(next => {
      this.board.columns = (next as Column[]).sort((a,b) => a.position.valueOf() - b.position.valueOf());
      for (var column of this.board.columns) {
        this.taskInit(column);
      }
    })
  }
  taskInit(column: Column) { 
    this.taskService.getTaskCards(column._id).subscribe(next => {
      column.taskcards = (next as TaskCard[]).sort((a,b) => a.position.valueOf() - b.position.valueOf());
    })
  }

  addTaskClick(column: Column) {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['/new-task', params['boardId'], column._id]);
    });
  }

  editTaskClick(taskcard: TaskCard) {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['/edit-task', params['boardId'], taskcard._columnId, taskcard._id]);
    });
  }

  commentTaskClick(taskcard: TaskCard) {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['/comments', params['boardId'], taskcard._columnId, taskcard._id]);
    });
  }

  editTitleClick() {
    const boardTitle: HTMLDivElement = document.getElementById('title-container') as HTMLDivElement;
    const titleInput: HTMLInputElement = document.getElementById('title-input') as HTMLInputElement;
    const editButton: HTMLButtonElement = document.getElementById('title-edit') as HTMLButtonElement;
    const saveButton: HTMLButtonElement = document.getElementById('title-save') as HTMLButtonElement;
    boardTitle.style.display = 'none';
    titleInput.style.display = 'block';
    titleInput.value = this.board.title;
    editButton.style.display = 'none';
    saveButton.style.display = 'block';
  }
  
  saveTitleClick() {
    const boardTitle: HTMLDivElement = document.getElementById('title-container') as HTMLDivElement;
    const titleInput: HTMLInputElement = document.getElementById('title-input') as HTMLInputElement;
    const editButton: HTMLButtonElement = document.getElementById('title-edit') as HTMLButtonElement;
    const saveButton: HTMLButtonElement = document.getElementById('title-save') as HTMLButtonElement;
    boardTitle.style.display = 'block';
    titleInput.style.display = 'none';
    editButton.style.display = 'block';
    saveButton.style.display = 'none';
    this.updateBoardTitle(titleInput.value);
  }
  
  drop(event: CdkDragDrop<Column>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.taskcards, event.previousIndex, event.currentIndex);
      let index = 0
      for (var task of event.container.data.taskcards) {
        task.position = index;
        this.taskService.updateTaskCardPosition(task._columnId, task._id, task._columnId, index).subscribe(() => {});
        index++;
      }
    } else {
      transferArrayItem(
        event.previousContainer.data.taskcards,
        event.container.data.taskcards,
        event.previousIndex,
        event.currentIndex,
      );
      let index = 0
      for (var task of event.container.data.taskcards) {
        task.position = index;
        this.taskService.updateTaskCardPosition(task._columnId, task._id, event.container.data._id, index).subscribe(() => {});
        task._columnId = event.container.data._id
        index++;
      }
      index = 0
      for (var task of event.previousContainer.data.taskcards) {
        task.position = index;
        this.taskService.updateTaskCardPosition(task._columnId, task._id, task._columnId, index).subscribe(() => {});
        index++;
      }
    }
  }

  updateBoardTitle(title: string) {
    if (this.inputLengthCheck(title, 50)) {
      const inputLengthDialog : HTMLDialogElement = document.getElementById('inputLengthError') as HTMLDialogElement;
      inputLengthDialog.show();
    }
    else {
      this.board.title = title;
      this.taskService.updateBoardTitle(this.board._id, title).subscribe(() => {});
    }
    
  }

  updateAllTaskCards() {
    for(var column of this.board.columns) {
      let index = 0
      for(var task of column.taskcards) {
        this.taskService.updateTaskCardPosition(task._columnId, task._id, column._id, index).subscribe(() => {});
        index++
      }
    }
  }

  togglePriority(taskcard: TaskCard) {
    taskcard.priority = !taskcard.priority
    this.taskService.updateTaskCardPriority(taskcard._columnId, taskcard._id, taskcard.priority).subscribe(() => {});
  }

  deleteTaskcardConfirm(taskcard: TaskCard) {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['/delete-task', params['boardId'], taskcard._columnId, taskcard._id]);
    });
  }

  assignTask(taskcard: TaskCard) {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['/assign', params['boardId'], taskcard._columnId, taskcard._id]);
    });
  }
  
  deleteBoardConfirm() {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['/delete-board', params['boardId']]);
    });
  }

  addUser() {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['/add-user', params['boardId']]);
    });
  }

  viewUsers() {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['view-users', params['boardId']]);
    });
  }

  inputLengthCheck(input: string, length: number) {
    if (input.length > length) {
      return true;
    } else return false;
  }

  

  close() {
    const inputLengthDialog : HTMLDialogElement = document.getElementById('inputLengthError') as HTMLDialogElement;

    inputLengthDialog.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdown: HTMLDivElement = document.getElementById("dropdown") as HTMLDivElement;
    const navDropdown: HTMLDivElement = document.getElementById("navbarDropdown") as HTMLDivElement;
    if (dropdown && navDropdown) {
      if ((event.target == document.getElementById("board-options") || event.target == document.getElementById("board-options-icon"))) {
        if (dropdown.classList.contains('is-active')) {
          dropdown.classList.remove('is-active')
        } else
        dropdown.classList.add('is-active');
      } else if(event.target == document.getElementById("navbarButton")) {
        if (navDropdown.classList.contains('is-active')){
          navDropdown.classList.remove('is-active')
        } else {
          navDropdown.classList.add('is-active')
        }
      } else {
        if (dropdown.classList.contains('is-active')) {
          dropdown.classList.remove('is-active')
        }
        if (navDropdown.classList.contains('is-active')) {
          navDropdown.classList.remove('is-active')
        }
      }
    }
    
  }

  uploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      // Send the file to the backend for OCR analysis
      this.http.post('http://localhost:3000/upload/analyze', formData).subscribe(
        (response: any) => {
          console.log('Text extracted successfully:', response.text);
          this.extractedText = response.text; // Save the extracted text

          // Create a new column and task with the extracted text
          this.createExtractedTextColumn();
        },
        (error) => {
          console.error('Failed to extract text:', error);
        }
      );
    }
  }

  createExtractedTextColumn() {
    // Create a new column named 'Extracted Text'
    const newColumn: Column = {
      _id: 'extractedTextColumn', // Temporary ID; replace with backend ID if needed
      title: 'Extracted Text',
      _boardId: this.board._id, // Use the current board ID
      position: this.board.columns.length, // Position at the end of the columns array
      taskcards: [] // Initialize with an empty taskcards array
    };
  
    // Create a new taskcard with the extracted text
    const newTaskCard: TaskCard = {
      _id: 'extractedTextCard', // Temporary ID; replace with backend ID if needed
      _columnId: 'extractedTextColumn', // Link it to the new column
      title: 'OCR Extracted Content',
      description: this.extractedText,
      position: 0, // First task in this column
      dueDate: null, // No due date for this card
      priority: false, // Default priority to false
      assignedTo: 'user' // Set 'assignedTo' parameter to 'user' as requested
    };
  
    // Push the new taskcard to the new column
    newColumn.taskcards.push(newTaskCard);
  
    // Add the new column to the board's columns array
    this.board.columns.push(newColumn);
  }

  logout() {
    this.authService.logout()
  }
}
