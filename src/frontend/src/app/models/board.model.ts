import { Column } from './column.model';

export class Board {
  constructor(
    public _id: string,
    public _ownerId: string,
    public title: string,
    public columns: Column[]
  ) {}
}
