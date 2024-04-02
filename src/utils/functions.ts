import { Signal } from "@/stores/neuro";

const a = 3;

function mainFunction(c: number) {
    return a * Math.pow(c, 0.5);
}

export function calculateC1(array: Signal[]) {
    return array.map((item) => ({
        ...item,
        c1: mainFunction(item.c0),
    }));
}

export type SignalKey = "c0" | "c1";

export function maxValue(array: Signal[], key: SignalKey) {
    return Math.max(...array.map((i) => i[key]));
}

export function minValue(array: Signal[], key: SignalKey) {
    return Math.min(...array.map((i) => i[key]));
}
