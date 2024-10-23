import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Provide methods for CRUD operations related to the kanban board.
 */
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

//kanban services

  /**
   * Get boards a user can access.
   * @returns Array of Board
   */
  getBoards() {
    return this.webReqService.get('boards');
  }

  /**
   * Get a specific board by boardId
   * @param boardId 
   * @returns Board
   */
  getBoard(boardId: string) {
    return this.webReqService.get(`boards/${boardId}`);
  }

  /**
   * Get columns by boardId
   * @param boardId 
   * @returns Array of Column
   */
  getColumns(boardId: string) {
    return this.webReqService.get(`boards/${boardId}/columns`);
  }

  /**
   * Get a specific column by boardId and columnId
   * @param boardId 
   * @param columnId 
   * @returns Column
   */
  getColumn(boardId: string, columnId: string) {
    return this.webReqService.get(`boards/${boardId}/columns/${columnId}`);
  }

  /**
   * Create a board
   * @param title title of board
   * @returns Board created
   */
  createBoard(title: string) {
    // send a web request to create a list
    return this.webReqService.post('boards', { title });
  }

  /**
   * Create a column
   * @param boardId id of board
   * @param title title of board
   * @param position order of column
   * @returns Column created
   */
  createColumn(boardId:string, title: string, position: Number) {
    // send a web request to create a list
    return this.webReqService.post(`boards/${boardId}/columns`, { title, position });
  }

  /**
   * Get TaskCards in a column by columnId
   * @param columnId 
   * @returns Array of TaskCard
   */
  getTaskCards(columnId: string) {
    return this.webReqService.get(`columns/${columnId}/taskcards`);
  }

  /**
   * Get Taskcard specified by by columnId and taskcardId
   * @param columnId 
   * @param taskcardId 
   * @returns TaskCard
   */
  getTaskCard(columnId: string, taskcardId: string) {
    return this.webReqService.get(`columns/${columnId}/taskcards/${taskcardId}`);
  }

  /**
   * Create a taskcard
   * @param columnId 
   * @param title 
   * @param description 
   * @param position 
   * @param date 
   * @returns Taskcard
   */
  createTaskCard(columnId:string, title: string, description: string, position: Number, date: Date) {
    return this.webReqService.post(`columns/${columnId}/taskcards`, { 
      title: title, 
      description: description,
      position: position,
      dueDate: date
    });
  }

  /**
   * Get comments by taskcardId
   * @param taskcardId 
   * @returns Array of Comment
   */
  getComments(taskcardId: string) {
    return this.webReqService.get(`taskcards/${taskcardId}/comments`);
  }

  /**
   * Create comment
   * @param taskcardId 
   * @param username 
   * @param message 
   * @param date 
   * @returns Comment
   */
  createComment(taskcardId: string, username: string, message: string, date: Date) {
    return this.webReqService.post(`taskcards/${taskcardId}/comments`, {
      username: username,
      message: message,
      date: date
    })
  }

  /**
   * Update Taskcard title, description, date
   * @param columnId columnId of TaskCard
   * @param taskcardId taskcardId of TaskCard
   * @param title new title
   * @param description new description
   * @param date new date
   * @returns Updated Taskcard
   */
  updateTaskCardDetails(columnId: string, taskcardId: string, title:string, description: string, date: Date) {
    return this.webReqService.patch(`columns/${columnId}/taskcards/${taskcardId}`, {
      title: title,
      description: description,
      dueDate: date
    })
  }
  
  /**
   * Update priority of Taskcard
   * @param columnId columnId of TaskCard
   * @param taskcardId taskcardId of TaskCard
   * @param priority new priority
   * @returns Updated Taskcard
   */
  updateTaskCardPriority(columnId: string, taskcardId: string, priority: Boolean) {
    return this.webReqService.patch(`columns/${columnId}/taskcards/${taskcardId}`, {
      priority: priority
    })
  }

  /**
   * Update username Taskcard is assigned to
   * @param columnId columnId of TaskCard
   * @param taskcardId taskcardId of TaskCard
   * @param username new username
   * @returns Updated Taskcard
   */
  updateTaskCardAssigned(columnId: string, taskcardId: string, username: string[]) {
    return this.webReqService.patch(`columns/${columnId}/taskcards/${taskcardId}`, {
      assignedTo: username
    })
  }
  
  /**
   * Update board title
   * @param boardId id of board
   * @param title new title
   * @returns updated board
   */
  updateBoardTitle(boardId: string, title: string) {
    return this.webReqService.patch(`boards/${boardId}`, { title: title })
  }

  /**
   * update position of taskcard
   * @param columnId columnId of TaskCard
   * @param taskcardId taskcardId of TaskCard
   * @param newColumnId id of new column
   * @param position new position
   * @returns updated taskcard
   */
  updateTaskCardPosition(columnId: string, taskcardId: string, newColumnId: string, position: Number) {
    return this.webReqService.patch(`columns/${columnId}/taskcards/${taskcardId}`, {
      _columnId: newColumnId,
      position: position
    })
  }

  /**
   * delete taskcard
   * @param columnId columnId of TaskCard
   * @param taskcardId taskcardId of TaskCard
   * @returns deleted taskcard
   */
  deleteTaskCard(columnId: string, taskcardId: string) {
    return this.webReqService.delete(`columns/${columnId}/taskcards/${taskcardId}`)
  }

  /**
   * delete column
   * @param boardId 
   * @param columnId 
   * @returns deleted column
   */
  deleteColumn(boardId: string, columnId: string) {
    return this.webReqService.delete(`boards/${boardId}/columns/${columnId}`)
  }

  /**
   * delete board
   * @param boardId 
   * @returns deleted board
   */
  deleteBoard(boardId: string) {
    return this.webReqService.delete(`boards/${boardId}`)
  }

  /**
   * add user to a board
   * @param boardId id of board
   * @param username username to add
   * @returns response
   */
  addUser(boardId:string, username: string) {
    return this.webReqService.post(`boards/${boardId}/add-user`, {
      username
    })
  }

  /**
   * get users with access to board
   * @param boardId id of board
   * @returns array of User
   */
  getUsers(boardId:string) {
    return this.webReqService.get(`boards/${boardId}/users`);
  }

  searchUsers(username:string) {
    return this.webReqService.post(`users/search`, {
      username
    });
  }

  uploadImage(formData: FormData) {
    return this.webReqService.post(`upload/analyze`, formData);
  }
}
