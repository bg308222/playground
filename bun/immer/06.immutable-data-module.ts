import { applyPatches, enablePatches, Patch, produce } from 'immer';
enablePatches();
interface Product {
    name: string;
    quantity: number;
    history: number[];
}

class ImmutableData<T extends object> {
    private _data: T;
    private inversePatches: Patch[][] = [];

    constructor(data: T) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    public setData(action: (draft: T) => void) {
        this._data = produce(this._data, (draft: T) => {
            action(draft);
        }, (_, inversePatches) => {
            this.inversePatches.push(inversePatches);
        });
    }

    public undo() {
        if (this.inversePatches.length > 0) {
            const patches = this.inversePatches.pop()!;
            this._data = applyPatches(this._data, patches);
        }
    }
}

const product = new ImmutableData<Product>({
    name: "robot",
    quantity: 100,
    history: []
});


console.log("1", product.data)

product.setData((draft) => {
    draft.quantity -= 10;
    draft.history.push(10);
})
console.log("2", product.data)

product.setData((draft) => {
    draft.quantity -= 30;
    draft.history.push(30);
})
console.log("3", product.data)

product.undo();
console.log("4", product.data)

product.undo();
console.log("5", product.data)


export {};