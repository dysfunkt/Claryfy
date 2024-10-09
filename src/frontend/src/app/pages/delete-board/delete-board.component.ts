import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { TaskCard } from '../../models/taskcard.model';

@Component({
  selector: 'app-delete-board',
  templateUrl: './delete-board.component.html',
  styleUrl: './delete-board.component.scss'
})
export class DeleteBoardComponent implements OnInit{
  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  board!: Board;
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskService.getBoard(params['boardId']).subscribe(next => {
          this.board = next as Board
          this.columnInit(this.board._id)
        })
      }
    )
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

  cancel() {
    this.router.navigate(['/kanban-view', this.board._id]);
  }

  deleteBoard() {
    for(var column of this.board.columns) {
      for(var task of column.taskcards) {
        this.taskService.deleteTaskCard(task._columnId, task._id).subscribe(() => {});
      }
      this.taskService.deleteColumn(column._boardId, column._id).subscribe(() => {})
    }
    this.taskService.deleteBoard(this.board._id).subscribe(() => {});
    this.router.navigate(['project-list']);
  }
}
