<template>
  <div>
    <h1>Neural Network Training</h1>
    <div id="loss-chart"></div>
    <div id="reference-chart"></div>
    <div id="prediction-chart"></div>
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import * as d3 from "d3";

export default {
  name: "NeuralNetwork",
  data() {
    return {
      learningRate: 0.01, // Начальная скорость обучения
      momentum: 0.2, // Начальный момент
      steps: 5000,
      errors: [],
      predictions: [],
      referenceFunction: [],
      epochInterval: 100, // Интервал обновления графика
      bestLoss: Number.POSITIVE_INFINITY,
      patience: 10, // Количество эпох без улучшения перед изменением параметров
      patienceCounter: 0, // Счетчик эпох без улучшения
    };
  },
  mounted() {
    this.trainModel();
  },
  methods: {
    async trainModel() {
      const a = 2.0;
      const C0 = tf.linspace(0.1, 10, 100);
      const C1 = C0.sqrt().mul(a);

      // Сохранение эталонной функции
      this.referenceFunction = await C1.array();

      const C0_scaled = this.normalize(C0);
      const C1_scaled = this.normalize(C1);

      let optimizer = tf.train.momentum(this.learningRate, this.momentum);

      const model = tf.sequential();
      model.add(
        tf.layers.dense({
          units: 1,
          inputShape: [1],
          activation: "softplus",
        })
      );

      model.compile({
        optimizer: optimizer,
        loss: "meanSquaredError",
      });

      const xs = C0_scaled.reshape([100, 1]);
      const ys = C1_scaled.reshape([100, 1]);

      await model.fit(xs, ys, {
        epochs: this.steps,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            this.errors.push(logs.loss);
            // console.log(`Epoch: ${epoch + 1} Loss: ${logs.loss}`);

            const preds = await model.predict(xs).array();
            this.predictions = preds.map((d) => d[0]);
            this.updateCharts();

            // Проверка улучшения сходимости
            if (logs.loss < this.bestLoss) {
              this.bestLoss = logs.loss;
              this.patienceCounter = 0;
            } else {
              this.patienceCounter += 1;
            }

            // Адаптивное изменение параметров
            if (this.patienceCounter >= this.patience) {
              this.patienceCounter = 0;
              if (this.learningRate > 0.0001) {
                this.learningRate = 0.005; // Уменьшаем скорость обучения
              }
              if (this.momentum < 0.89) {
                this.momentum += 0.1; // Увеличиваем момент
              }
              console.log(`LR: ${this.learningRate}, M: ${this.momentum}`);
              optimizer = tf.train.momentum(this.learningRate, this.momentum);
              model.compile({
                optimizer: optimizer,
                loss: "meanSquaredError",
              });
            }
          },
        },
      });

      // Прогнозирование с использованием обученной модели после завершения обучения
      model
        .predict(C0)
        .array()
        .then((preds) => {
          this.predictions = preds.map((d) => d[0]);
          this.updateCharts();
        });
    },
    normalize(tensor) {
      const min = tensor.min();
      const max = tensor.max();
      return tensor.sub(min).div(max.sub(min));
    },
    updateCharts() {
      this.drawLossChart();
      this.drawReferenceChart();
      this.drawPredictionChart();
    },
    drawLossChart() {
      const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      d3.select("#loss-chart").select("svg").remove();

      const svg = d3
        .select("#loss-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleLinear()
        .domain([0, this.errors.length])
        .range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(this.errors)])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("path")
        .datum(this.errors)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d, i) => x(i))
            .y((d) => y(d))
        );
    },
    drawReferenceChart() {
      const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      d3.select("#reference-chart").select("svg").remove();

      const svg = d3
        .select("#reference-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain([0, 10]).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(this.referenceFunction)])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("path")
        .datum(this.referenceFunction)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d, i) => x(i * 0.1))
            .y((d) => y(d))
        );
    },
    drawPredictionChart() {
      const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      d3.select("#prediction-chart").select("svg").remove();

      const svg = d3
        .select("#prediction-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain([0, 10]).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(this.predictions)])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("path")
        .datum(this.predictions)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d, i) => x(i * 0.1))
            .y((d) => y(d))
        );
    },
  },
};
</script>

<style>
#loss-chart,
#reference-chart,
#prediction-chart {
  margin-top: 20px;
}
</style>
