// src/mocks/orders.ts
import { Order } from '../Interfaces/Interfaces';

export const mockOrders: Order[] = [
    {
        id: '1',
        address: 'ул. Ленина, д. 10',
        nickname: 'Филиал 1',
        dateOrder: '2025-10-06',
        phone: '+79991234567',
        frontDoorQuantity: 2,
        inDoorQuantity: 3,
        messageSeller: 'Проверка',
        fullName: ''
    },
    {
        id: '2',
        address: 'ул. Пушкина, д. 15',
        nickname: 'Филиал 2',
        dateOrder: '2025-10-07',
        phone: '+79997654321',
        frontDoorQuantity: 1,
        inDoorQuantity: 2,
        messageSeller: 'Тест',
        fullName: ''
    },
];