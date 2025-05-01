export interface ValidationError {
    pointer: string;
    detail: string;
}

export interface BadRequestResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    errors: ValidationError[];
}