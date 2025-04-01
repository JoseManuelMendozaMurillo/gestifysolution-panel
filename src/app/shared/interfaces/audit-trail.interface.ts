export interface AuditTimestamps {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export interface UserAuditTrail {
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
}

export interface AuditTrail extends AuditTimestamps, UserAuditTrail {

}