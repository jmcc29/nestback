// src/projects/projects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { PROJECTS } from './data/projects.data';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private projects = [...PROJECTS]; // copia en memoria

  findAll(orgCode?: string): Project[] {
    if (orgCode) return this.projects.filter(p => p.orgCode === orgCode);
    return this.projects;
  }

  findOneById(id: string): Project {
    const proj = this.projects.find(p => p.id === id);
    if (!proj) throw new NotFoundException(`Proyecto ${id} no encontrado`);
    return proj;
  }

  create(dto: CreateProjectDto): Project {
    const id = `project:${dto.orgCode}:${dto.code}`;
    const newProj: Project = {
      id,
      orgCode: dto.orgCode,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      createdAt: new Date(),
    };
    // Nota: en demo no validamos duplicados; agrégalo si lo necesitas
    this.projects.push(newProj);
    return newProj;
  }

  update(id: string, dto: UpdateProjectDto): Project {
    const proj = this.findOneById(id);
    if (dto.name !== undefined) proj.name = dto.name;
    if (dto.description !== undefined) proj.description = dto.description;
    return proj;
  }

  remove(id: string): void {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) throw new NotFoundException(`Proyecto ${id} no encontrado`);
    this.projects.splice(idx, 1);
  }
}
