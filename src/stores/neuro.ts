import {reactive, Ref, ref, watch} from "vue";
import {defineStore} from "pinia";
import {sourceWeightGenerator} from "../utils/generators";
import {
  calculateC1,
  calcDeltaW1,
  maxValue,
  minValue,
  SignalKey,
  calcDeltaB1,
  calcDeltaW2,
  calcDeltaB2,
  calcDeltaB3,
  calcDeltaW13,
  calcDeltaW23,
} from "../utils/functions";
import {currentData, startedData} from "@/utils/data";

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

type DeltaObject = {
  w1: number;
  deltaW1: number;
  newW1: number;
  b1: number;
  deltaB1: number;
  newB1: number;
  w2: number;
  deltaW2: number;
  newW2: number;
  b2: number;
  deltaB2: number;
  newB2: number;
  w13: number;
  deltaW13: number;
  newW13: number;
  w23: number;
  deltaW23: number;
  newW23: number;
  b3: number;
  deltaB3: number;
  newB3: number;
};

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

    obj.c1calcNorm = Number(
      (
        startedData.w13 * signals[i].y1 +
        startedData.w23 * signals[i].y2 +
        startedData.b3
      ).toFixed(3)
    );
    obj.c1calc = Number((obj.c1calcNorm * (c1Max - c1Min) + c1Min).toFixed(3));

    ar.push(obj);
  }

  return ar;
}

// вектор входных сигналов
let signals = sourceWeightGenerator();
// вектор выходных сигналов
signals = calculateC1(signals);
const c0Min = minValue(signals, "c0");
const c0Max = maxValue(signals, "c0");
const c1Min = minValue(signals, "c1");
const c1Max = maxValue(signals, "c1");

function init(): TableData[] {
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
  const calcData = ref<TableData[]>([]);
  const intervalFunction = ref();
  const learningStep = ref(0);

  const calculatedData: Ref<DeltaObject[]> = ref([]);

  function calculateDeltas() {
    const deltaW1 = calcDeltaW1(
      initedData.value,
      currentWeightsAndRatios.value.w13,
      learningStep.value === 0
        ? 0
        : calculatedData.value[learningStep.value - 1].deltaW1
    );
    const newW1 = currentWeightsAndRatios.value.w1 - deltaW1;

    const deltaB1 = calcDeltaB1(
      initedData.value,
      currentWeightsAndRatios.value.w13,
      learningStep.value === 0
        ? 0
        : calculatedData.value[learningStep.value - 1].deltaB1
    );
    const newB1 = currentWeightsAndRatios.value.b1 - deltaB1;

    const deltaW2 = calcDeltaW2(
      initedData.value,
      currentWeightsAndRatios.value.w23,
      learningStep.value === 0
        ? 0
        : calculatedData.value[learningStep.value - 1].deltaW2
    );
    const newW2 = currentWeightsAndRatios.value.w2 - deltaW2;

    const deltaB2 = calcDeltaB2(
      initedData.value,
      currentWeightsAndRatios.value.w23,
      learningStep.value === 0
        ? 0
        : calculatedData.value[learningStep.value - 1].deltaB2
    );
    const newB2 = currentWeightsAndRatios.value.b2 - deltaB2;

    const deltaW13 = calcDeltaW13(
      initedData.value,
      learningStep.value === 0
        ? 0
        : calculatedData.value[learningStep.value - 1].deltaW13
    );
    const newW13 = currentWeightsAndRatios.value.w13 - deltaW13;

    const deltaW23 = calcDeltaW23(
      initedData.value,
      learningStep.value === 0
        ? 0
        : calculatedData.value[learningStep.value - 1].deltaW23
    );
    const newW23 = currentWeightsAndRatios.value.w23 - deltaW23;

    const deltaB3 = calcDeltaB3(
      initedData.value,
      learningStep.value === 0
        ? 0
        : calculatedData.value[learningStep.value - 1].deltaB3
    );
    const newB3 = currentWeightsAndRatios.value.b3 - deltaB3;

    const deltasObject: DeltaObject = {
      w1: currentWeightsAndRatios.value.w1,
      deltaW1: deltaW1,
      newW1: newW1,
      b1: currentWeightsAndRatios.value.b1,
      deltaB1: deltaB1,
      newB1: newB1,
      w2: currentWeightsAndRatios.value.w2,
      deltaW2: deltaW2,
      newW2: newW2,
      b2: currentWeightsAndRatios.value.b2,
      deltaB2: deltaB2,
      newB2: newB2,
      w13: currentWeightsAndRatios.value.w13,
      deltaW13: deltaW13,
      newW13: newW13,
      w23: currentWeightsAndRatios.value.w23,
      deltaW23: deltaW23,
      newW23: newW23,
      b3: currentWeightsAndRatios.value.b3,
      deltaB3: deltaB3,
      newB3: newB3,
    };

    const newWeightsAndRatios = {
      w1: newW1,
      b1: newB1,
      w2: newW2,
      b2: newB2,
      w13: newW13,
      w23: newW23,
      b3: newB3,
    };

    currentWeightsAndRatios.value = newWeightsAndRatios;

    addLearningStep(deltasObject);

    calcData.value = initedData.value.map((item: TableData) => {
      const x1 = Number(
        (deltasObject.w1 * item.c0Normalize + deltasObject.b1).toFixed(3)
      );
      const x2 = Number(
        (deltasObject.w2 * item.c0Normalize + deltasObject.b2).toFixed(3)
      );
      const y1 = Number(Math.log(1 + Math.exp(x1)).toFixed(5));
      const y2 = Number(Math.log(1 + Math.exp(x2)).toFixed(5));
      const c1calcNorm = Number(
        (
          deltasObject.w13 * y1 +
          deltasObject.w23 * y2 +
          deltasObject.b3
        ).toFixed(3)
      );
      const c1calc = Number((c1calcNorm * (c1Max - c1Min) + c1Min).toFixed(3));

      return {
        ...item,
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2,
        c1calcNorm: c1calcNorm,
        c1calc: c1calc,
      };
    });

    learningStep.value += 1;

    // TODO:  среднеквадратичная ошибка
    // корень (1/100 * (С1 - С1 calc) в квадрате) для каждого сигнала
  }

  function learnModel() {
    intervalFunction.value = setInterval(calculateDeltas, 1500);
  }

  function stopLearn() {
    clearInterval(intervalFunction.value);
  }

  function addLearningStep(obj: DeltaObject) {
    calculatedData.value.push(obj);
  }

  watch(learningStep, () => {
    if (learningStep.value === 100) clearInterval(intervalFunction.value);
  });

  return {
    initedData,
    calculatedData,
    startedWeightsAndRatios,
    currentWeightsAndRatios,
    learnModel,
    calcData,
    learningStep,
    intervalFunction,
    stopLearn,
  };
});
