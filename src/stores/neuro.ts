import { ref } from "vue";
import { defineStore } from "pinia";
import { sourceWeightGenerator } from "../utils/generators";
import { calculateC1, maxValue, minValue, SignalKey } from "../utils/functions";
import { startedWeightsAndConstants1, startedWeightsAndConstants2 } from "@/utils/data";

export type Signal = {
    c0: number;
    c1: number;
    c0Normalize: number;
    c1Normalize: number;
};

function normalizeC(item: Signal, key: SignalKey, cMin: number, cMax: number) {
    return (item[key] - cMin) / (cMax - cMin);
}

function init(): {
    c0: number;
    c1: number;
    c0Normalize: number;
    c1Normalize: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}[] {
    let signals = sourceWeightGenerator();
    signals = calculateC1(signals);

    const c0Min = minValue(signals, "c0");
    const c0Max = maxValue(signals, "c0");
    const c1Min = minValue(signals, "c1");
    const c1Max = maxValue(signals, "c1");

    signals = signals.map((i) => ({
        ...i,
        c0Normalize: normalizeC(i, "c0", c0Min, c0Max),
        c1Normalize: normalizeC(i, "c1", c1Min, c1Max),
    }));

    const activations = calcFuncActivation(signals);

    const result = signals.map((item, idx) => {
        return {
            ...item,
            ...activations[idx],
        };
    });

    return result;
}

function calcFuncActivation(signals: Signal[]) {
    const ar = [];

    for (let i = 0; i < 100; i++) {
        const obj: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        } = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
        };

        obj.x1 =
            startedWeightsAndConstants1[i].w * signals[i].c0Normalize +
            startedWeightsAndConstants1[i].b;
        obj.x2 =
            startedWeightsAndConstants2[i].w * signals[i].c0Normalize +
            startedWeightsAndConstants2[i].b;

        obj.y1 = Math.log(1 + Math.exp(obj.x1));
        obj.y2 = Math.log(1 + Math.exp(obj.x2));

        ar.push(obj);
    }

    return ar;
}

export const useNeuroStore = defineStore("NeuroStore", () => {
    const data = ref<
        {
            c0: number;
            c1: number;
            c0Normalize: number;
            c1Normalize: number;
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        }[]
    >(init());

    return { data };
});
