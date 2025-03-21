// @ts-nocheck

import { produce } from "immer";

export function useImmutable<T extends object>(baseState: T) {
    const state = shallowRef(baseState);
    const setState = (updater: (draft: T) => void) => {
        state.value = produce(state.value, updater);
    }
    return [state, setState];
}

const [product, setProduct] = useImmutable({
    name: "robot",
    quantity: 100,
    history: []
});

setProduct((draft) => {
    draft.quantity -= 10;
    draft.history.push(10);
});




function shallowRef() {}