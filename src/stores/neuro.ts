import { reactive, Ref, ref } from "vue";
import { defineStore } from "pinia";
import { sourceWeightGenerator } from "../utils/generators";
import { calculateC1, calcDeltaW1, maxValue, minValue, SignalKey } from "../utils/functions";
import { currentData, learningSteps, startedData } from "@/utils/data";

export type Signal = {
    c0: number;
    c1: number;
    c0Normalize: number;
    c1Normalize: number;
};

export type Activation = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};

export type CalcC = {
    c1calcNorm: number;
    c1calc: number;
};

type SignalActs = Signal & Activation;
export type TableData = Signal & Activation & CalcC;

function normalizeC(item: Signal, key: SignalKey, cMin: number, cMax: number) {
    return (item[key] - cMin) / (cMax - cMin);
}

function calcFuncActivation(signals: Signal[]): Activation[] {
    const ar = [];

    for (let i = 0; i < 100; i++) {
        const obj: Activation = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
        };

        obj.x1 = startedData.w1 * signals[i].c0Normalize + startedData.b1;
        obj.x2 = startedData.w2 * signals[i].c0Normalize + startedData.b2;
        obj.y1 = Math.log(1 + Math.exp(obj.x1));
        obj.y2 = Math.log(1 + Math.exp(obj.x2));

        ar.push(obj);
    }

    return ar;
}

function calcC(signals: SignalActs[], c1Min: number, c1Max: number): CalcC[] {
    const ar = [];

    for (let i = 0; i < 100; i++) {
        const obj: CalcC = {
            c1calcNorm: 0,
            c1calc: 0,
        };

        obj.c1calcNorm =
            startedData.w13 * signals[i].y1 + startedData.w23 * signals[i].y2 + startedData.b3;
        obj.c1calc = obj.c1calcNorm * (c1Max - c1Min) + c1Min;

        ar.push(obj);
    }

    return ar;
}

function init(): TableData[] {
    // вектор входных сигналов
    let signals = sourceWeightGenerator();
    // вектор выходных сигналов
    signals = calculateC1(signals);

    // макс и мин сигналов
    const c0Min = minValue(signals, "c0");
    const c0Max = maxValue(signals, "c0");
    const c1Min = minValue(signals, "c1");
    const c1Max = maxValue(signals, "c1");

    // нормирование
    signals = signals.map((i) => ({
        ...i,
        c0Normalize: normalizeC(i, "c0", c0Min, c0Max),
        c1Normalize: normalizeC(i, "c1", c1Min, c1Max),
    }));

    // аргумент функции активации
    const activations = calcFuncActivation(signals);

    const signalActs: SignalActs[] = signals.map((item, idx) => {
        return {
            ...item,
            ...activations[idx],
        };
    });

    // расчетные значения параметра С1
    const parametersC = calcC(signalActs, c1Min, c1Max);

    const result: TableData[] = signalActs.map((item, idx) => {
        return {
            ...item,
            ...parametersC[idx],
        };
    });

    return result;
}

export const useNeuroStore = defineStore("NeuroStore", () => {
    const initedData = ref<TableData[]>(init());
    const startedWeightsAndRatios = reactive(startedData);
    const currentWeightsAndRatios = ref(currentData);

    const calculatedData: Ref<object[]> = ref([]);

    function learnModel(arr: TableData[]) {
        for (let j = 1; j <= learningSteps; j++) {
            const deltaW1 = calcDeltaW1(
                arr,
                currentWeightsAndRatios.value.w13,
                j === 1 ? 0 : currentWeightsAndRatios.value.w1,
            );
            // console.log(JSON.parse(JSON.stringify(deltaW1)));

            const newW1 = currentData.w1 - deltaW1;

            const deltasObject = {
                w1: currentData.w1,
                deltaW1: deltaW1,
                newW1: newW1,
            };

            currentWeightsAndRatios.value.w1 = newW1;

            // const deltaB = deltaB3(arr, currentData.b3, deltas.b3);
            // currentData.b3 = currentData.b3 - deltaB;
            // deltas.b3 = deltaB;
            // console.log(JSON.parse(JSON.stringify(currentData.b3)));

            addLearningStep(deltasObject);
        }
    }

    function addLearningStep(obj: object) {
        calculatedData.value.push(obj);
    }

    return {
        initedData,
        calculatedData,
        startedWeightsAndRatios,
        currentWeightsAndRatios,
        learnModel,
    };
});
