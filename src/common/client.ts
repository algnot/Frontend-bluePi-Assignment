import { CreateOrderRequest, Order, PayOrderRequest, PayOrderResponse } from "@/types/order";
import { ProductsResponse, ProductTypeListResponse } from "@/types/product";
import axios from "axios";
import Swal from "sweetalert2";

const handleError = (e: unknown) => {
    if(axios.isAxiosError(e)){
        if(e.response && e.response.data && e.response.data.message) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: e.response.data.message,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: e.message,
            });
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
        });
    }
    return undefined;
}

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_PATH,
    headers: {
        "Content-Type": "application/json"
    }
});

export class Client {
    async getAllProduct(): Promise<ProductsResponse | undefined> {
        try {
            const response = await client.get("/product/list");
            return response.data;
        } catch (e) {
            return handleError(e);
        }
    }

    async getAllProductType(): Promise<ProductTypeListResponse | undefined> {
        try {
            const response = await client.get("/product-type/list");
            return response.data;
        } catch (e) {
            return handleError(e);
        }
    }

    async getOrder(name: string): Promise<Order | undefined> {
        try {
            const response = await client.get(`/order/${name}`);
            return response.data;
        } catch (e) {
            return handleError(e);
        }
    }

    async cancelOrder(name: string): Promise<{id: number} | undefined> {
        try {
            const response = await client.post(`/order/cancel`, {
                sale_order_name: name
            });
            return response.data;
        } catch (e) {
            return handleError(e);
        }
    }

    async createOrder(request: CreateOrderRequest): Promise<Order | undefined> {
        try {
            const response = await client.post("/order/create", request);
            return response.data;
        } catch (e) {
            return handleError(e);
        }
    }

    async payOrder(request: PayOrderRequest): Promise<PayOrderResponse | undefined> {
        try {
            const response = await client.post("/order/pay", request);
            return response.data;
        } catch (e) {
            return handleError(e);
        }
    }
}
