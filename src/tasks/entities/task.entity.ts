export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export class Task {
  id: string;             // Ej: "task:alpha:erp:42"
  orgCode: string;        // Ej: "alpha"
  projectCode: string;    // Ej: "erp"
  taskNumber: number;     // Ej: 42
  title: string;
  description?: string;
  assignedTo?: string;    // Ej: "user:juan"
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
