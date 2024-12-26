import "./common";

const toy = { price: 10, cost: 20, quantity: 100 };

let totalPrice: number | undefined;
function priceEffect() {
    totalPrice = toy.price * toy.quantity;
}

let totalCost: number | undefined;
function costEffect() {
    totalCost = toy.cost * toy.quantity;
}

function templateAction(topic: string) {
    console.log(topic);
    console.log({ toy, totalPrice, totalCost })
    console.log();
}

priceEffect();
costEffect();
templateAction("init");

toy.price = 30;
priceEffect();
templateAction("update price");

toy.quantity *= 10;
priceEffect();
costEffect();
templateAction("update quantity");