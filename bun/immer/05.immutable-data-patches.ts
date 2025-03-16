import { applyPatches, enablePatches, type Patch } from 'immer';
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

const patches: Patch[] = [
    {
        op: "add",
        path: ["history", 0],
        value: 10
    },
    {
        op: "replace",
        path: ["quantity"],
        value: 90
    }
]

const inversePatches: Patch[] = [
  {
    op: "remove",
    path: [ "history", 0 ],
  }, {
    op: "replace",
    path: [ "quantity" ],
    value: 100,
  }
]

const productAfterPatch = applyPatches(product, patches);
console.log("productAfterPatch =", productAfterPatch);

const productAfterInversePatch = applyPatches(productAfterPatch, inversePatches);
console.log("productAfterInversePatch =", productAfterInversePatch);
