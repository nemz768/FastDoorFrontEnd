export interface Order {
    id: string;
    fullName: string;
    address: string;
    phone: string;
    dateOrder: string;
    frontDoorQuantity: number;
    inDoorQuantity: number;
    messageSeller: string;
    installerName?: string | null;
    nickname: string;
}


export interface EditedOrder {
    messageMainInstaller: string | null;
    frontDoorQuantity: number;
    inDoorQuantity: number;
    installerName: string;
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


export interface Availability{
    date: string;
    available: boolean;
    frontDoorQuantity: number;
    inDoorQuantity: number;
    formattedDate?: string;
}