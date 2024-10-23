import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Board } from '../../models/board.model';
import { User } from '../../models/user.model';
import { debounceTime, firstValueFrom, Subject } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit{
  constructor(private taskService: TaskService, private router: Router, private authService: AuthService, private route: ActivatedRoute) {  
    this.searchSubject.pipe(debounceTime(1000)).subscribe((query: any) => {
      if (query) {
        this.searchUsernames(query);
      } else {
        this.usernames = []; // Clear results if the input is empty
      }
    });
  }
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.trim();
    this.searchSubject.next(this.searchQuery);
    this.clickedflag = false
  }

  private searchUsernames(query: string): void {
    this.usernames = []
    this.taskService.searchUsers(query).subscribe(
      (next) => {
        let queryUsers = next as User[]; // Update the list of usernames
        for (var user of queryUsers) {
          this.usernames.push(user.username)
        }
      },
      (error) => {
        console.error('Error fetching usernames:', error);
      }
    );
  }

  clickedflag = false
  selectUsername(username: string): void {
    const usernameInput: HTMLInputElement = document.getElementById('usernameInput') as HTMLInputElement;
    usernameInput.value = username // Set input value to clicked username
    this.clickedflag = true
    this.usernames = []; // Clear the dropdown results
  }

  userIds!: any[];
  users: string[] = [];
  usernames: string[] = [];
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

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
