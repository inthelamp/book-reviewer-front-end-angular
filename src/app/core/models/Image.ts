export interface Image
{
    id: string;
    fileName: string;
    mimetype: string,
    size: number;
    bytes: Buffer;
    createdAt: Date;
}