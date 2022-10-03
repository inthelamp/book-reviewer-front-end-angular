import { BookCover } from "./BookCover.model";

export enum ReviewStatus 
{
    Draft = "Draft",
    Published = "Published",    
    Inactive = "Inactive"
}

export type Authors = readonly [string?, string?, string?];

export interface Review
{
    id?: string; 
    subject: string; 
    bookTitle?: string;
    bookAuthors?: Authors;       
    isbn?: string; 
    bookCover?: BookCover;
    content: string; 
    status: ReviewStatus;
    createdAt?: Date;         
    updatedAt?: Date;
}