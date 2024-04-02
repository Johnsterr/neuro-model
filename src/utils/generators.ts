import { Signal } from "@/stores/neuro";

export function sourceWeightGenerator() {
    const data: Signal[] = [];

    for (let i = 1; i <= 100; i++) {
        data.push({
            c0: i,
            c1: 0,
            c0Normalize: 0,
            c1Normalize: 0,
        });
    }

    return data;
}

export function startedWeightsAndConstants() {
    const ar = [];
    for (let i = 0; i < 100; i++) {
        ar.push({
            w: Number(Math.random().toFixed(2)),
            b: 0,
        });
    }

    for (let i = 0; i < ar.length; i++) {
        ar[i].b = Number(Math.random().toFixed(2));
    }

    console.log(ar);
}

export function startedWeightsAndConstants2() {
    const ar = [];
    for (let i = 0; i < 100; i++) {
        ar.push({
            w13: Number(Math.random().toFixed(2)),
            w23: Number(Math.random().toFixed(2)),
            b: 0,
        });
    }

    for (let i = 0; i < ar.length; i++) {
        ar[i].b = Number(Math.random().toFixed(2));
    }

    console.log(ar);
}
