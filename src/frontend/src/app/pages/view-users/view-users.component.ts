import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.scss'
})
export class ViewUsersComponent implements OnInit{
  constructor(private taskService: TaskService, private router: Router, private authService: AuthService, private route: ActivatedRoute) {  }


  userIds!: any[];

  users: User[] = [];

  ngOnInit() { 
    this.route.params.subscribe(
      (params: Params) => {
        this.taskService.getUsers(params['boardId']).subscribe(next => {
          this.userIds = next as string[];
          this.usersInit()
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

  cancel() {
    this.route.params.subscribe(
      (params: Params) => {
        this.router.navigate(['/kanban-view', params['boardId']]);
      }
    )
  }

}
