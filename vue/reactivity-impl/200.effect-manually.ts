export {};

const toy = { price: 10, quantity: 100 };

let totalPrice: number | undefined;
totalPrice = toy.price * toy.quantity;

console.log({ toy, totalPrice });

toy.price = 20;
totalPrice = toy.price * toy.quantity;
console.log({ toy, totalPrice });
