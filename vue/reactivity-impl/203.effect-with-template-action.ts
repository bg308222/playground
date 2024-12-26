import "./common";

const toy = { price: 10, quantity: 100 };

let totalPrice: number | undefined;
function effect() {
    totalPrice = toy.price * toy.quantity;
}

function templateAction() {
    console.log({ toy, totalPrice });
}

effect();
templateAction();

toy.price = 20;
effect();
templateAction();
