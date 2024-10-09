import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Board } from '../../models/board.model';
import { User } from '../../models/user.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit{
  constructor(private taskService: TaskService, private router: Router, private authService: AuthService, private route: ActivatedRoute) {  }

  userIds!: any[];
  users: string[] = [];

  board!: Board;
  ngOnInit() { 
    this.route.params.subscribe(
      (params: Params) => {
        this.taskService.getBoard(params['boardId']).subscribe(next => {
          this.board = next as Board
          this.taskService.getUsers(params['boardId']).subscribe(next => {
            this.userIds = next as string[];
            this.usersInit()
          })
        })
      }
    )
  }

  usersInit() {
    for (var id of this.userIds) {
      this.authService.getUsernameWithId(id['_userId']).subscribe(next => {
        let user = next as User
        this.users.push(user.username);
        
      })
    }
  }

  async addButtonClick(username: string) {
    if (this.users.includes(username)) {
      const userExistsDialog : HTMLDialogElement = document.getElementById('userExistsError') as HTMLDialogElement;
      userExistsDialog.show();
    } else {
      let usernamecheck = await this.checkUser(username);
      if(!usernamecheck) {
        //username does not exist
        const usernameDialog : HTMLDialogElement = document.getElementById('usernameError') as HTMLDialogElement;
        usernameDialog.show();
      } else {
        this.taskService.addUser(this.board._id, username).subscribe((res:any) => {
          if (res === true) {
            const mainModal: HTMLDivElement = document.getElementById('main') as HTMLDivElement;
            const subModal: HTMLDivElement = document.getElementById('sub') as HTMLDivElement;
            mainModal.classList.add('is-hidden');
            subModal.classList.remove('is-hidden');
          } else {
            console.log('fail')
            console.log(res)
          }
        })
      }
    }
    
  }

  async checkUser(username: string) {
    const usercheck$ = this.authService.checkUser(username);
    return await firstValueFrom(usercheck$) as Boolean;
    
  }

  close() {
    const usernameDialog : HTMLDialogElement = document.getElementById('usernameError') as HTMLDialogElement;
    const userExistsDialog : HTMLDialogElement = document.getElementById('userExistsError') as HTMLDialogElement;
      userExistsDialog.close();
      usernameDialog.close();
  }

  cancel() {
    this.router.navigate(['/kanban-view', this.board._id]);
  }

}
