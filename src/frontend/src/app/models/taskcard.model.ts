export class TaskCard {
  constructor(
    public _id: string,
    public _columnId: string,
    public title: string,
    public description: string,
    public position: Number,
    public dueDate: Date | null,
    public priority: Boolean,
    public assignedTo: string
  ) {}
}
