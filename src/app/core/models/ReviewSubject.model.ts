import { ReviewStatus } from "./Review.model";

export interface ReviewSubject
{
    id: string; 
    subject: string; 
    status: ReviewStatus;
    isOwner: boolean;
}