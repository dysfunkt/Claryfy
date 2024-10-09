import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskCard } from '../../models/taskcard.model';
import { formatDate } from '@angular/common';
import { AuthService } from '../../auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  boardId!: string;
  taskcard!: TaskCard;
  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = params['boardId']
        this.taskService.getTaskCard(params['columnId'], params['taskcardId']).subscribe(next => {
          this.taskcard = next as TaskCard;
          console.log(this.taskcard.title)
        })
      }
    )
  }

  cancel() {
    this.router.navigate(['/kanban-view', this.boardId]);
  }

  save() {
    const titleInput: HTMLInputElement = document.getElementById('taskTitleInput') as HTMLInputElement;
    const dateInput: HTMLInputElement = document.getElementById('taskDateInput') as HTMLInputElement;
    const descInput: HTMLInputElement = document.getElementById('taskDescriptionInput') as HTMLInputElement;
    const date: Date = new Date(dateInput.value)
    console.log(this.dateBoundaryCheck(date));
    if (titleInput.value == '') {
      const titleDialog : HTMLDialogElement = document.getElementById('titleError') as HTMLDialogElement;
      titleDialog.show();
    } 
    else if (this.inputLengthCheck(titleInput.value, 50)) {
      const inputLength50Dialog : HTMLDialogElement = document.getElementById('inputLength50Error') as HTMLDialogElement;
      inputLength50Dialog.show();
    }
    else if (this.inputLengthCheck(descInput.value, 250)) {
      const inputLength250Dialog : HTMLDialogElement = document.getElementById('inputLength250Error') as HTMLDialogElement;
      inputLength250Dialog.show();
    }
    else if (isNaN(date.getTime())) {
      const dateDialog : HTMLDialogElement = document.getElementById('dateError') as HTMLDialogElement;
      dateDialog.show();
    }
    else if (this.dateBoundaryCheck(date)) {
      const dateDialog : HTMLDialogElement = document.getElementById('dateError') as HTMLDialogElement;
      dateDialog.show();
    }
    else {
      this.taskService.updateTaskCardDetails(this.taskcard._columnId, this.taskcard._id, titleInput.value, descInput.value, date).subscribe(() => {});
    this.router.navigate(['/kanban-view', this.boardId]);
    }
  }

  close() {
    const titleDialog : HTMLDialogElement = document.getElementById('titleError') as HTMLDialogElement;
    const inputLength250Dialog : HTMLDialogElement = document.getElementById('inputLength250Error') as HTMLDialogElement;
    const inputLength50Dialog : HTMLDialogElement = document.getElementById('inputLength50Error') as HTMLDialogElement;
    const dateDialog : HTMLDialogElement = document.getElementById('dateError') as HTMLDialogElement;
    titleDialog.close();
    inputLength250Dialog.close();
    inputLength50Dialog.close();
    dateDialog.close()
    
  }

  formatDate(date: Date|null) {
    if (date){
      return formatDate(date, 'yyyy-MM-dd', 'en-GB');
    }
    return null
  }

  inputLengthCheck(input: string, length: number) {
    if (input.length > length) {
      return true;
    } else return false;
  }

  dateBoundaryCheck(date: Date) {
    let dateObj = new Date(date.toDateString());
    let today = new Date(new Date().toDateString())
    let before = dateObj < today;
    today.setFullYear(today.getFullYear() + 2);
    let after = dateObj > today;
    return before || after
  }
  
}
