export {};

const toy = { price: 10, quantity: 100 };

let totalPrice: number | undefined;
function effect() {
    totalPrice = toy.price * toy.quantity;
}
effect();
console.log({ toy, totalPrice });

toy.price = 20;
effect();
console.log({ toy, totalPrice });
