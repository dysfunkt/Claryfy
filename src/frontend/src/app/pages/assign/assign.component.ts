import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Board } from '../../models/board.model';
import { TaskCard } from '../../models/taskcard.model';
import { User } from '../../models/user.model';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrl: './assign.component.scss'
})
export class AssignComponent implements OnInit{
  boardId!: string;
  users: string[] = [];
  selectedUser: string = '';
  assignedUsers: string[] = [];
  userIds!: any[];

  constructor(private taskService: TaskService, private router: Router, private authService: AuthService, private route: ActivatedRoute) {  }

  taskcard!: TaskCard;
  ngOnInit() { 
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = params['boardId']
        this.taskService.getTaskCard(params['columnId'], params['taskcardId']).subscribe(next => {
          this.taskcard = next as TaskCard;
          this.assignedUsers = this.taskcard.assignedTo
          if (this.assignedUsers.includes('Unassigned')) {
            this.assignedUsers = []
          }
          console.log(this.taskcard.title)
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

  assignUser(): void {
    
    const select: HTMLSelectElement = document.getElementById('select') as HTMLSelectElement;
    let val = select.value
    if (val && !this.assignedUsers.includes(val)) {
      this.assignedUsers.push(val); // Add selected user to the assigned users list
      select.value = ''; // Clear the selection
    }
  }

  removeUser(user: string): void {
    this.assignedUsers = this.assignedUsers.filter(u => u !== user); // Remove user from the assigned list
  }

  assignButtonClick(username: string[]) {
    console.log(username);
    
    if(username.length === 0) {
      const assignButton: HTMLButtonElement = document.getElementById('assignButton') as HTMLButtonElement;
      assignButton.classList.add('is-loading');
      this.taskService.updateTaskCardAssigned(this.taskcard._columnId, this.taskcard._id, ['Unassigned']).subscribe(() => {
        const mainModal: HTMLDivElement = document.getElementById('main') as HTMLDivElement;
        const assignedModal: HTMLDivElement = document.getElementById('assigned') as HTMLDivElement;
        mainModal.classList.add('is-hidden');
        assignedModal.classList.remove('is-hidden');
      });
    }
    
    else {
      const assignButton: HTMLButtonElement = document.getElementById('assignButton') as HTMLButtonElement;
      assignButton.classList.add('is-loading');
      this.taskService.updateTaskCardAssigned(this.taskcard._columnId, this.taskcard._id, username).subscribe(() => {
        const mainModal: HTMLDivElement = document.getElementById('main') as HTMLDivElement;
        const assignedModal: HTMLDivElement = document.getElementById('assigned') as HTMLDivElement;
        mainModal.classList.add('is-hidden');
        assignedModal.classList.remove('is-hidden');
      });
    }
  }

  cancel() {
    this.router.navigate(['/kanban-view', this.boardId]);
  }
}
