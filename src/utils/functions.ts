import { TableData, Signal } from "@/stores/neuro";
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

export function calcDeltaW1(data: TableData[], w13: number, deltaW1: number) {
    let sum: number = 0;

    data.map((item) => {
        sum +=
            -2 *
            (item.c1Normalize - item.c1calcNorm) *
            w13 *
            (Math.exp(item.x1) / (1 + Math.exp(item.x1))) *
            item.c0Normalize;
    });

    // console.log("delta W1 sum", JSON.parse(JSON.stringify(sum)));

    const result = learningData.lr * sum + learningData.moment * deltaW1;
    // console.log("delta W1 result", JSON.parse(JSON.stringify(result)));

    return result;
}

export function calcDeltaB1(data: TableData[], w13: number, deltaB1: number) {
    let sum: number = 0;

    data.map((item) => {
        sum +=
            -2 *
            (item.c1Normalize - item.c1calcNorm) *
            w13 *
            (Math.exp(item.x1) / (1 + Math.exp(item.x1)));
    });
    // console.log("delta B1 sum", JSON.parse(JSON.stringify(sum)));

    const result = learningData.lr * sum + learningData.moment * deltaB1;
    // console.log("delta B1 result", JSON.parse(JSON.stringify(result)));

    return result;
}

export function calcDeltaW2(data: TableData[], w23: number, deltaW2: number) {
    let sum: number = 0;

    data.map((item) => {
        sum +=
            -2 *
            (item.c1Normalize - item.c1calcNorm) *
            w23 *
            (Math.exp(item.x2) / (1 + Math.exp(item.x2))) *
            item.c0Normalize;
    });

    // console.log("delta W2 sum", JSON.parse(JSON.stringify(sum)));

    const result = learningData.lr * sum + learningData.moment * deltaW2;
    // console.log("delta W2 result", JSON.parse(JSON.stringify(result)));

    return result;
}

export function calcDeltaB2(data: TableData[], w23: number, deltaB2: number) {
    let sum: number = 0;

    data.map((item) => {
        sum +=
            -2 *
            (item.c1Normalize - item.c1calcNorm) *
            w23 *
            (Math.exp(item.x2) / (1 + Math.exp(item.x2)));
    });

    // console.log("delta B2 sum", JSON.parse(JSON.stringify(sum)));

    const result = learningData.lr * sum + learningData.moment * deltaB2;
    // console.log("delta B2 result", JSON.parse(JSON.stringify(result)));

    return result;
}

export function calcDeltaW13(data: TableData[], deltaW13: number) {
    let sum: number = 0;

    data.map((item) => {
        sum += -2 * (item.c1Normalize - item.c1calcNorm);
        // TODO: дописать умножение на Y1
    });

    // console.log("delta W2 sum", JSON.parse(JSON.stringify(sum)));

    const result = learningData.lr * sum + learningData.moment * deltaW13;
    // console.log("delta W2 result", JSON.parse(JSON.stringify(result)));

    return result;
}

export function calcDeltaW23(data: TableData[], deltaW23: number) {
    let sum: number = 0;

    data.map((item) => {
        sum += -2 * (item.c1Normalize - item.c1calcNorm);
        // TODO: дописать умножение на Y2
    });

    // console.log("delta W2 sum", JSON.parse(JSON.stringify(sum)));

    const result = learningData.lr * sum + learningData.moment * deltaW23;
    // console.log("delta W2 result", JSON.parse(JSON.stringify(result)));

    return result;
}

export function calcDeltaB3(data: TableData[], deltaB3: number) {
    let sum: number = 0;

    data.map((item) => {
        sum += -2 * (item.c1Normalize - item.c1calcNorm);
    });

    const result = learningData.lr * sum + learningData.moment * deltaB3;
    return result;
}

const deltas = {
    w1: 0,
    b3: 0,
};
