import { enablePatches, produce } from 'immer';
enablePatches();
interface Product {
    name: string;
    quantity: number;
    history: number[];
}

const product = {
    name: "robot",
    quantity: 100,
    history: []
}

const product1 = sell(product, 10);
const product2 = sell(product1, 20);

function sell(product: Product, quantity: number) {
    return produce(product, (draft) => {
        draft.quantity -= quantity;
        draft.history.push(quantity);
    });
}

export {};
