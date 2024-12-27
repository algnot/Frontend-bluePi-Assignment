export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    type_id: string;
    recommend: boolean;
    active: boolean;
    image_id: string | null; 
    created_by: string;
    updated_by: string;
    created_at: string; 
    updated_at: string; 
}

export interface ProductsResponse {
    products: Product[];
}

export interface ProductType {
    id: string;
    name: string;
    active: boolean;
    image_id: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
};

export interface ProductTypeListResponse {
    product_type_list: ProductType[];
};
