// src/orgs/orgs.data.ts
import { Org } from '../entities/org.entity';

export const ORGS: Org[] = [
  {
    id: 'org:alpha',
    code: 'alpha',
    name: 'Organización Alpha',
    description: 'Organización de prueba con varios proyectos.',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'org:beta',
    code: 'beta',
    name: 'Organización Beta',
    description: 'Segunda organización usada para pruebas internas.',
    createdAt: new Date('2024-03-22'),
  },
];
