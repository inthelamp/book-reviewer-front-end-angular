export interface User
{
    email: string;
    username: string;    
    password: string;
    confirmPassword: string;
    birthday?: Date;
}