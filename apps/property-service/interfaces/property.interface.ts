export interface Property {
    id: number;
    user_id: number;
    title: number;
    description?: string;
    address?: string;
    price: number;
    created_at: Date;
    updated_at: number
}