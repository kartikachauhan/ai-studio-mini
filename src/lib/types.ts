export type StyleOption = 'Editorial' | 'Streetwear' | 'Vintage';

export interface GenerateRequest {
    imageDataUrl: string;
    prompt: string;
    style: StyleOption;
}

export interface GenerateResponse {
    id: string;
    imageUrl: string;
    prompt: string;
    style: StyleOption;
    createdAt: string;
}  
