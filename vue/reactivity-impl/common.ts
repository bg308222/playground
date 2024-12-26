export interface Product {
    price: number;
    cost: number;
    quantity: number;
}

export type ProductKey = keyof Product;

let activeEffect: Function | null = null;

export function reactive<T extends object>(obj: T) {
    return new Proxy(obj, {
        get(target, key) {
            if (activeEffect !== null) {
                track(key as string);
            }
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            trigger(key as string);
            return true;
        }
    })
}

export function watchEffect(effect: Function) {
    activeEffect = effect;
    effect();
    activeEffect = null;
}

const effectsMap: Record<string, Set<Function>> = {};
function track(key: string) {
    if (!effectsMap[key]) {
        effectsMap[key] = new Set();
    }

    if (activeEffect !== null) {
        effectsMap[key].add(activeEffect);
    }
}

function trigger(key: string) {
    if (effectsMap[key]) {
        effectsMap[key].forEach(effect => effect());
    }
}