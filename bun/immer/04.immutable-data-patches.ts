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

sell(product, 10);
sell(product, 20);

function sell(product: Product, quantity: number) {
    return produce(product, (draft) => {
        draft.quantity -= quantity;
        draft.history.push(quantity);
    }, (patches, inversePatches) => {
        console.log("patches", patches);
        console.log("inversePatches", inversePatches);
    });
}

export {};
