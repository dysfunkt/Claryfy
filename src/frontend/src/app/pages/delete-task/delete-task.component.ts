import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskCard } from '../../models/taskcard.model';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.scss'
})
export class DeleteTaskComponent implements OnInit{
  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}
  boardId!: string;
  taskcard!: TaskCard
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

  deleteTaskcard() {
    this.taskService.deleteTaskCard(this.taskcard._columnId, this.taskcard._id).subscribe(() => {});
    this.router.navigate(['/kanban-view', this.boardId]);
  }
}
