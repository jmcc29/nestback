import { Injectable, NotFoundException } from '@nestjs/common';
import { Org } from './entities/org.entity';
import { ORGS } from './data/orgs.data';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';

@Injectable()
export class OrgsService {
  private orgs = [...ORGS];

  findAll(): Org[] {
    return this.orgs;
  }

  findOneById(id: string): Org {
    const org = this.orgs.find((o) => o.id === id);
    if (!org) throw new NotFoundException(`Organización ${id} no encontrada`);
    return org;
  }

  create(dto: CreateOrgDto): Org {
    const id = `org:${dto.code}`;
    // si ya existe, puedes validar aquí (simple demo no valida duplicados)
    const newOrg: Org = {
      id,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      createdAt: new Date(),
    };
    this.orgs.push(newOrg);
    return newOrg;
  }

  update(id: string, dto: UpdateOrgDto): Org {
    const org = this.findOneById(id);
    // No permitimos cambiar el code/id en este demo
    if (dto.name !== undefined) org.name = dto.name;
    if (dto.description !== undefined) org.description = dto.description;
    return org;
  }

  remove(id: string): void {
    const idx = this.orgs.findIndex((o) => o.id === id);
    if (idx === -1) throw new NotFoundException(`Organización ${id} no encontrada`);
    this.orgs.splice(idx, 1);
  }
}
