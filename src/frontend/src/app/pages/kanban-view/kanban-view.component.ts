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

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

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
    if (dropdown) {
      if ((event.target == document.getElementById("board-options") || event.target == document.getElementById("board-options-icon"))) {
        if (dropdown.classList.contains('is-active')) {
          dropdown.classList.remove('is-active')
        } else
        dropdown.classList.add('is-active');
      } 
      else {
        if (dropdown.classList.contains('is-active')) {
          dropdown.classList.remove('is-active')
        }
      }
    }
  }  
}
