import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { Column } from '../../models/column.model';
import { TaskCard } from '../../models/taskcard.model';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent implements OnInit{

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  boardId!: string;
  column!: Column;
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = params['boardId']
        this.taskService.getColumn(this.boardId, params['columnId']).subscribe(next => {
          this.column = next as Column;
          this.taskService.getTaskCards(this.column._id).subscribe(next => {
            this.column.taskcards = next as TaskCard[];
          })
        })
      }
    )
  }

  createTask() {
    const titleInput: HTMLInputElement = document.getElementById('taskTitleInput') as HTMLInputElement;
    const dateInput: HTMLInputElement = document.getElementById('taskDateInput') as HTMLInputElement;
    const descInput: HTMLInputElement = document.getElementById('taskDescriptionInput') as HTMLInputElement;
    const date: Date = new Date(dateInput.value)
    if (titleInput.value == '') {
      const titleDialog : HTMLDialogElement = document.getElementById('titleError') as HTMLDialogElement;
      titleDialog.show();
    } 
    else if (this.inputLengthCheck(titleInput.value, 50)) {
      const inputLength50Dialog : HTMLDialogElement = document.getElementById('inputLength50Error') as HTMLDialogElement;
      inputLength50Dialog.show();
    }
    else if (this.inputLengthCheck(descInput.value, 500)) {
      const inputLength250Dialog : HTMLDialogElement = document.getElementById('inputLength500Error') as HTMLDialogElement;
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
      this.taskService.createTaskCard(this.column._id, titleInput.value, descInput.value, new Number(this.column.taskcards.length), date).subscribe(() => {});
    this.router.navigate(['/kanban-view', this.boardId]);
    }
  }

  dateBoundaryCheck(date: Date) {
    let dateObj = new Date(date.toDateString());
    let today = new Date(new Date().toDateString())
    let before = dateObj < today;
    today.setFullYear(today.getFullYear() + 2);
    let after = dateObj > today;
    return before || after
  }

  cancel() {
    this.router.navigate(['/kanban-view', this.boardId]);
  }

  close() {
    const titleDialog : HTMLDialogElement = document.getElementById('titleError') as HTMLDialogElement;
    const inputLength250Dialog : HTMLDialogElement = document.getElementById('inputLength500Error') as HTMLDialogElement;
    const inputLength50Dialog : HTMLDialogElement = document.getElementById('inputLength50Error') as HTMLDialogElement;
    const dateDialog : HTMLDialogElement = document.getElementById('dateError') as HTMLDialogElement;
    titleDialog.close();
    inputLength250Dialog.close();
    inputLength50Dialog.close();
    dateDialog.close()
  }
  
  inputLengthCheck(input: string, length: number) {
    if (input.length > length) {
      return true;
    } else return false;
  }

  uploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
      const loading : HTMLDivElement = document.getElementById('loading') as HTMLDivElement;
      const fail : HTMLDivElement = document.getElementById('fail') as HTMLDivElement;
      loading.style.display = 'block';
      fail.style.display = 'none';


      // Send the file to the backend for OCR analysis
      this.taskService.uploadImage(formData).subscribe(
        (response: any) => {
          console.log('Text extracted successfully:', response.text);
          const descInput: HTMLInputElement = document.getElementById('taskDescriptionInput') as HTMLInputElement; // Save the extracted text
          descInput.value = response.text;
          loading.style.display = 'none';
        
        },
        (error) => {
          console.error('Failed to extract text:', error);
          loading.style.display = 'none';
          loading.style.display = 'block';
        }
      );
    }
  }
}
