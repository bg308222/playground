import { applyPatches, current, enablePatches, produce, type Patch } from "immer";
enablePatches();

interface Order {
    id: number;
    name: string;
    price: number;
}

interface PatchHistory {
    patches: Patch[];
    inversePatches: Patch[];
}


const orders: Order[] = [
    { id: 1, name: "apple", price: 100 },
    { id: 2, name: "banana", price: 200 },
    { id: 3, name: "cherry", price: 300 },
];


function useImmer<T extends object>(original: T) {
    const patchHistories: PatchHistory[] = [];
    let state = { value: original };
    const update = (updater: (draft: T) => void) => {
        state.value = produce(state.value, updater, (patches, inversePatches) => {
            patchHistories.push({ patches, inversePatches });
        });
    };
    const undo = () => {
        if (patchHistories.length > 0) {
            const { patches, inversePatches } = patchHistories.pop()!;
            state.value = applyPatches(state.value, inversePatches);
        }
    }

    return [state, update, undo] as [{ value: T }, typeof update, typeof undo];
}

const [state, update, undo] = useImmer(orders);
console.log(state.value);

update((draft) => {
    draft[0].price = 200;
});
console.log(state.value);
undo();
console.log(state.value);