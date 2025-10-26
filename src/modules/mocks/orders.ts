// src/mocks/orders.ts
import { Order } from '../Interfaces/Interfaces';

export const mockOrders: Order[] = [
    {
        id: "1",
        fullName: "Иван Петров",
        nickname: "ivan_p",
        phone: "+7 (913) 123-45-67",
        address: "г. Новосибирск, ул. Ленина, д. 10, кв. 5",
        dateOrder: "2025-10-20",
        frontDoorQuantity: 1,
        inDoorQuantity: 2,
        messageSeller: "Клиент просит установить в выходные",
        installerName: "Алексей Смирнов"
    },
    {
        id: "2",
        fullName: "Мария Козлова",
        nickname: "maria_k",
        phone: "+7 (913) 234-56-78",
        address: "г. Новосибирск, пр. Дзержинского, д. 5, кв. 12",
        dateOrder: "2025-10-21",
        frontDoorQuantity: 1,
        inDoorQuantity: 0,
        messageSeller: "Только входная дверь, межкомнатные — позже",
        installerName: null // или ""
    },
    {
        id: "3",
        fullName: "Сергей Иванов",
        nickname: "sergey_i",
        phone: "+7 (913) 345-67-89",
        address: "г. Новосибирск, ул. Гоголя, д. 15, кв. 33",
        dateOrder: "2025-10-22",
        frontDoorQuantity: 2,
        inDoorQuantity: 3,
        messageSeller: "Срочный заказ! Входную — в приоритете",
        installerName: "Дмитрий Орлов"
    },
    {
        id: "4",
        fullName: "Анна Волкова",
        nickname: "anna_v",
        phone: "+7 (913) 456-78-90",
        address: "г. Новосибирск, ул. Фрунзе, д. 22, кв. 7",
        dateOrder: "2025-10-23",
        frontDoorQuantity: 1,
        inDoorQuantity: 1,
        messageSeller: "Уточнить время с клиентом",
        installerName: undefined // допустимо, т.к. поле опциональное
    }
];