import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";

export interface CrudServiceInterface<CREATINGDTO, UPDATINGDTO, LISTDTO, ID> {
    getAll(): Observable<LISTDTO[]>;
    getAllInactive(): Observable<LISTDTO[]>;
    getAllActive(): Observable<LISTDTO[]>;
    getById(id: ID): Observable<LISTDTO | null>;
    getByActiveId(id: ID): Observable<LISTDTO | null>;
    getByInactiveId(id: ID): Observable<LISTDTO | null>;
    create(dto: CREATINGDTO, form: FormGroup): Observable<LISTDTO>;
    update(id: ID, dto: UPDATINGDTO): Observable<LISTDTO>;
    restoreById(id: ID): Observable<boolean>;
    softDeleteById(id: ID): Observable<boolean>;
    deleteById(id: ID): Observable<boolean>;
}