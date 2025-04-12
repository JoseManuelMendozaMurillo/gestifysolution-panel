import { AuditTrail } from "../../shared/interfaces/audit-trail.interface";
import { CreateUser, UpdateUser, User } from "../../shared/interfaces/users.interface";

export interface CreateBoss {
    user: CreateUser,
    phone: string|null,
    birthdate: Date|null
}

export interface UpdateBoss {
    user?: UpdateUser,
    phone?: string,
    birthdate?: Date
}

export interface Boss extends AuditTrail {
    id: number;
    user: User,
    phone: string|null,
    birthdate: string|null
}