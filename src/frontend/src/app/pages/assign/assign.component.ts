import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Board } from '../../models/board.model';
import { TaskCard } from '../../models/taskcard.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrl: './assign.component.scss'
})
export class AssignComponent implements OnInit{
  boardId!: string;
  users: User[] = [];
  userIds!: any[];

  constructor(private taskService: TaskService, private router: Router, private authService: AuthService, private route: ActivatedRoute) {  }

  taskcard!: TaskCard;
  ngOnInit() { 
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = params['boardId']
        this.taskService.getTaskCard(params['columnId'], params['taskcardId']).subscribe(next => {
          this.taskcard = next as TaskCard;
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
        this.users.push(user);
        
      })
    }
  }

  assignButtonClick(username: string) {
    console.log(username);
    if (username === 'Select User') {

    } 
    else if (username === 'Unassign') {
      const assignButton: HTMLButtonElement = document.getElementById('assignButton') as HTMLButtonElement;
      assignButton.classList.add('is-loading');
      this.taskService.updateTaskCardAssigned(this.taskcard._columnId, this.taskcard._id, 'Unassigned').subscribe(() => {
        const mainModal: HTMLDivElement = document.getElementById('main') as HTMLDivElement;
        const unassignedModal: HTMLDivElement = document.getElementById('unassigned') as HTMLDivElement;
        mainModal.classList.add('is-hidden');
        unassignedModal.classList.remove('is-hidden');
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
