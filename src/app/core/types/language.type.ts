import { Observable } from "rxjs";

export type Language = {
    code: string,
    flagIcon: string,
    name: Observable<string>,
}