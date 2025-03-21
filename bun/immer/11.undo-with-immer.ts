// @ts-nocheck

import { applyPatches, Patch, produce } from "immer";

export function useImmutable<T extends object>(baseState: T) {
    const inversePatchesHistory: Patch[] = [];

    const state = shallowRef(baseState);
    const setState = (updater: (draft: T) => void) => {
        state.value = produce(state.value, updater, (_, inversePatches) => {
            inversePatchesHistory.push(...inversePatches);
        });
    }
    const undo = () => {
        const inversePatches = inversePatchesHistory.pop();
        if (inversePatches) {
            state.value = applyPatches(state.value, inversePatches);
        }
    }
    const reset = () => {
        state.value = baseState;
        inversePatchesHistory.length = 0;
    }
    return [state, setState, undo, reset];
}

const [product, setProduct, undo, reset] = useImmutable({
    name: "robot",
    quantity: 100,
    history: []
});

setProduct((draft) => {
    draft.quantity -= 10;
    draft.history.push(10);
});

function shallowRef() {}