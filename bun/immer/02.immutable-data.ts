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
console.log("product1", product1);
const product2 = sell(product1, 20);
console.log("product2", product2);

console.log("product", product);

console.log(product === product2); // false

function sell(product: Product, quantity: number) {
    const newProduct = structuredClone(product);
    // const newProduct = { ...product };
    // const newProduct = JSON.parse(JSON.stringify(product)) as Product;
    newProduct.quantity -= quantity;
    newProduct.history.push(quantity);
    return newProduct;
}

export {};
