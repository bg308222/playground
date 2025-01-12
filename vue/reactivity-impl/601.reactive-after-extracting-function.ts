import { watchEffect, reactive } from "./common";

const toy = reactive({ price: 10, cost: 20, quantity: 100 });

watchEffect(() => {
    const totalPrice = toy.price * toy.quantity;
    console.log("price effect: ", totalPrice);
});
watchEffect(() => {
    const totalCost = toy.cost * toy.quantity;
    console.log("cost effect: ", totalCost);
});

console.log("===== Set price =====");
toy.price = 30;

console.log("===== Set quantity =====");
toy.quantity *= 10;