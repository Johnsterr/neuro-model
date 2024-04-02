import { Dat, Signal } from "@/stores/neuro";
import { currentData, learningData, learningSteps } from "./data";

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

export function deltaW1(data: Dat[], w13: number, deltaW1: number) {
    let sum: number = 0;

    data.map((item, idx) => {
        sum +=
            -2 *
            (item.c1Normalize - item.c1calcNorm) *
            w13 *
            (Math.exp(item.x1) / (1 + Math.exp(item.x1))) *
            item.c0Normalize;
    });

    const result = learningData.lr * sum + learningData.moment * deltaW1;
    // console.log(result);

    return result;
}

export function deltaB3(data: Dat[], b3: number, deltaB3: number) {
    let sum: number = 0;

    data.map((item, idx) => {
        sum += -2 * (item.c1Normalize - item.c1calcNorm);
    });

    const result = learningData.lr * sum + learningData.moment * deltaB3;
    return result;
}

const deltas = {
    w1: 0,
    b3: 0,
};

export function learnModel(arr: Dat[]) {
    for (let j = 1; j <= learningSteps; j++) {
        // const deltaW = deltaW1(arr, currentData.w13, deltas.w1);
        const deltaB = deltaB3(arr, currentData.b3, deltas.b3);
        currentData.b3 = currentData.b3 - deltaB;
        deltas.b3 = deltaB;
        console.log(JSON.parse(JSON.stringify(currentData.b3)));
    }
}
