import { reactive, watchEffect } from "./common";

const toy = reactive({ price: 10, cost: 20, quantity: 100 });

watchEffect(() => {
    const totalPrice = toy.price * toy.quantity;
    console.log("price effect: ", { toy, totalPrice});
    // call diff algorithm to update the view
})

watchEffect(() => {
    const totalCost = toy.cost * toy.quantity;
    console.log("cost effect: ", { toy, totalCost});
    // call diff algorithm to update the view
})

console.log("============ init finished: ", toy);
toy.price = 30;
toy.quantity *= 10;