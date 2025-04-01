export interface CreateUser {
    username: string;
    email: string,
    firstName: string,
    lastName: string,
    password: string,
}

export interface UpdateUser {
    email?: string,
    firstName?: string,
    lastName?: string,
    password?: string,
}

export interface User {
    username: string;
    email: string,
    firstName: string,
    lastName: string,
    active: boolean,
}