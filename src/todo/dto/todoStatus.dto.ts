import { TodoStatusEnum } from "src/entity/todo.entity";

export class TodoStatus{
    status = TodoStatusEnum.in_progress??TodoStatusEnum.completed;
    startTime: any;
}