import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TASKS } from './data/tasks.data';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks = [...TASKS];

  findAll(filter?: { orgCode?: string; projectCode?: string }) {
    if (!filter) return this.tasks;
    const { orgCode, projectCode } = filter;
    return this.tasks.filter(t =>
      (orgCode ? t.orgCode === orgCode : true) &&
      (projectCode ? t.projectCode === projectCode : true),
    );
  }

  findOneById(id: string): Task {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new NotFoundException(`Tarea ${id} no encontrada`);
    return task;
  }

  create(dto: CreateTaskDto): Task {
    const id = `task:${dto.orgCode}:${dto.projectCode}:${dto.taskNumber}`;
    const now = new Date();
    const task: Task = {
      id,
      orgCode: dto.orgCode,
      projectCode: dto.projectCode,
      taskNumber: dto.taskNumber,
      title: dto.title,
      description: dto.description,
      assignedTo: dto.assignedTo,
      status: dto.status,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    return task;
  }

  update(id: string, dto: UpdateTaskDto): Task {
    const task = this.findOneById(id);
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.assignedTo !== undefined) task.assignedTo = dto.assignedTo;
    if (dto.status !== undefined) task.status = dto.status;
    task.updatedAt = new Date();
    return task;
  }

  remove(id: string): void {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new NotFoundException(`Tarea ${id} no encontrada`);
    this.tasks.splice(idx, 1);
  }
}
