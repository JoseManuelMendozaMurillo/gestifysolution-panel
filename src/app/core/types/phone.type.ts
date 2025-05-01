import { Country } from "./country.type"

export type Phone = {
    country: Country|null,
    phone: number|null; 
}