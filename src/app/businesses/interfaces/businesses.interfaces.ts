import { AuditTrail } from "../../shared/interfaces/audit-trail.interface"
import { FileInterface } from "../../shared/interfaces/files.interface"

export interface Business extends AuditTrail {
    id: number
    name: string
    description: string | null
    logo: FileInterface | null
    rfc: string
    establishmentDate: string | null
    active: boolean
    activeChangedBy: string | null
    activeChangedAt: string | null
    industry: Industry
    businessesType: BusinessesType
    taxRegimen: TaxRegimen
}

export interface Industry extends AuditTrail {
    id: number
    industry: string
    description: string
}

export interface BusinessesType extends AuditTrail {
    id: number
    code: string
    type: string
    description: string
}

export interface TaxRegimen extends AuditTrail {
    id: number
    regimen: string
    description: string
}
