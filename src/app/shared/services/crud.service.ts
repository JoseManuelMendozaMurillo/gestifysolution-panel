import { inject, Injectable } from '@angular/core';
import { CrudServiceInterface } from '../interfaces/crud-service.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { BadRequestResponse, ValidationError } from '../interfaces/bad-request.interface';
import { ValidatorService } from '../../core/validations/validator.service';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<CREATINGDTO, UPDATINGDTO, LISTDTO, ID> implements CrudServiceInterface<CREATINGDTO, UPDATINGDTO, LISTDTO, ID> {

  constructor(
    protected http: HttpClient, 
    protected apiUrl: string
  ) { }

  public getAll(): Observable<LISTDTO[]> {
    throw new Error('Method not implemented.');
  }

  public getAllInactive(): Observable<LISTDTO[]> {
    throw new Error('Method not implemented.');
  }

  public getAllActive(): Observable<LISTDTO[]> {
    throw new Error('Method not implemented.');
  }

  public getById(id: ID): Observable<LISTDTO | null> {
    throw new Error('Method not implemented.');
  }

  public getByActiveId(id: ID): Observable<LISTDTO | null> {
    throw new Error('Method not implemented.');
  }

  public getByInactiveId(id: ID): Observable<LISTDTO | null> {
    throw new Error('Method not implemented.');
  }

  public create(dto: CREATINGDTO, form: FormGroup): Observable<LISTDTO> {
    return this.http.post<LISTDTO>(this.apiUrl, dto)
            .pipe(
              catchError((error) => {
                if (error.status === 400) {
                  const badRequestResponse: BadRequestResponse = error.error;
                  console.error('Bad Request:', badRequestResponse.detail);
                  const errors: ValidationError[] = badRequestResponse.errors ?? [];
                  ValidatorService.setValidationErrors(errors, form);
                } else {
                  console.error('An error occurred:', error.message);
                }
                // Return an observable with a user-facing error message
                return throwError(() => new Error('Something bad happened; please try again later.'));
              })
            );  
  }

  public update(id: ID, dto: UPDATINGDTO): Observable<LISTDTO> {
    throw new Error('Method not implemented.');
  }

  public restoreById(id: ID): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public softDeleteById(id: ID): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  public deleteById(id: ID): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
}
