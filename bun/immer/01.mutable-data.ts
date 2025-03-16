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
console.log(product === product2);

function sell(product: Product, quantity: number) {
    product.quantity -= quantity;
    product.history.push(quantity);
    return product;
}

export {};