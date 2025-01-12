export {};

const toy = { price: 10, quantity: 100 };

let totalPrice: number | undefined;
totalPrice = toy.price * toy.quantity;

console.log({ toy, totalPrice }); // 1000

toy.price = 20;
console.log({ toy, totalPrice }); // 1000
