export interface AuditTimestamps {
    createdAt: string|null;
    updatedAt: string|null;
    deletedAt: string|null;
}

export interface UserAuditTrail {
    createdBy: string|null;
    updatedBy: string|null;
    deletedBy: string|null;
}

export interface AuditTrail extends AuditTimestamps, UserAuditTrail {

}