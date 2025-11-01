// src/projects/projects.data.ts
import { Project } from '../entities/project.entity';

export const PROJECTS: Project[] = [
  {
    id: 'project:alpha:erp',
    orgCode: 'alpha',
    code: 'erp',
    name: 'Sistema ERP Interno',
    description: 'Proyecto para integrar módulos administrativos.',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'project:alpha:webapp',
    orgCode: 'alpha',
    code: 'webapp',
    name: 'Plataforma Web Comercial',
    description: 'Proyecto público para clientes externos.',
    createdAt: new Date('2024-04-01'),
  },
  {
    id: 'project:beta:crm',
    orgCode: 'beta',
    code: 'crm',
    name: 'CRM Corporativo',
    description: 'Sistema de gestión de relaciones con clientes.',
    createdAt: new Date('2024-06-15'),
  },
];
