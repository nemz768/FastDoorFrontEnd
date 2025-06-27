export interface Order {
    id: string;
    fullName: string;
    address: string;
    phone: string;
    dateOrder: string;
    frontDoorQuantity: number;
    inDoorQuantity: number;
    messageSeller: string;
    installerName?: string; // null возможен
    nickname: string;
}

export interface OrdersResponse {
    orders: Order[];
    totalPages: number;
    currentPage: number;

}


export interface NavItems {
    label: string;
    route: string;
}