import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { TaskCard } from '../../models/taskcard.model';
import { User } from '../../models/user.model';
import { Comment } from '../../models/comment.model'

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit{
  username!: string;
  boardId!: string;
  taskcard!: TaskCard;
  comments!: Comment[];

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardId = params['boardId']
        this.taskService.getTaskCard(params['columnId'], params['taskcardId']).subscribe(next => {
          this.taskcard = next as TaskCard;
          console.log(this.taskcard.title)
          this.taskService.getComments(this.taskcard._id).subscribe(next => {
            let temp = next as Comment[];
            temp.reverse();
            this.comments = temp;
          })
        })
        
      }
    )
    this.authService.getUsername().subscribe(next => {
      this.username = (next as User).username
    })
  }

  backToBoard() {
    this.router.navigate(['/kanban-view', this.boardId]);
  }

  comment(message: string) {
    if (message.length === 0) {
      const commentInput: HTMLInputElement = document.getElementById('commentInput') as HTMLInputElement;
      commentInput.value = '';
    } else {
      this.taskService.createComment(this.taskcard._id, this.username, message, new Date()).subscribe(next => {
        let newComment = next as Comment;
        this.comments.unshift(newComment);
        const commentInput: HTMLInputElement = document.getElementById('commentInput') as HTMLInputElement;
      commentInput.value = '';
      })
    }
    
  }

  uploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
      const commentInput: HTMLInputElement = document.getElementById('commentInput') as HTMLInputElement; 
      commentInput.value = 'Loading...'


      // Send the file to the backend for OCR analysis
      this.taskService.uploadImage(formData).subscribe(
        (response: any) => {
          console.log('Text extracted successfully:', response.text);
          commentInput.value = response.text;

        
        },
        (error) => {
          console.error('Failed to extract text:', error);
        }
      );
    }
  }
}
