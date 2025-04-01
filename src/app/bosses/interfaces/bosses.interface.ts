import { AuditTrail } from "../../shared/interfaces/audit-trail.interface";
import { CreateUser, UpdateUser, User } from "../../shared/interfaces/users.interface";

export interface CreateBoss {
    user: CreateUser,
    phone?: number,
    birthdate?: Date
}

export interface UpdateBoss {
    user?: UpdateUser,
    phone?: number,
    birthdate?: Date
}

export interface Boss extends AuditTrail {
    id: number;
    user: User,
    phone: number,
    birthdate: Date
}