<template>
  <div>
    <h1>Построение модели нейронной сети</h1>
    <button @click="trainModel">Обучение модели</button>
    <div id="charts">
      <div id="loss-chart"></div>
      <div id="chart"></div>
      <div id="chart-100"></div>
      <div id="chart-500"></div>
      <div id="chart-700"></div>
      <div id="chart-1000"></div>
      <div id="chart-1500"></div>
      <div id="chart-2000"></div>
      <div id="chart-2800"></div>
      <div id="chart-3500"></div>
      <div id="chart-4400"></div>
      <div id="chart-6000"></div>
      <div id="chart-8000"></div>
      <div id="chart-10000"></div>
      <div id="chart-20000"></div>
      <div id="chart-30000"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as tf from "@tensorflow/tfjs";

export default {
  name: "NeuralNetwork",
  data() {
    return {
      a: 2,
      C0: d3.range(0.1, 10.1, 0.1),
      C1: [],
      predictions: [],
      x: null,
      y: null,
      C0_min: null,
      C0_max: null,
      C1_min: null,
      C1_max: null,
      learningRate: 0.005,
      momentum: 0.8,
      losses: [],
      epochCount: 30000,
      updateEpochs: [
        100, 500, 700, 1000, 1500, 2000, 2800, 3500, 4400, 6000, 8000, 10000,
        20000, 30000,
      ], // Эпохи для обновления графиков
    };
  },
  mounted() {
    this.calculateReferenceFunction();
    this.initializeCharts();
  },
  methods: {
    calculateReferenceFunction() {
      this.C1 = this.C0.map((x) => this.a * Math.sqrt(x));
    },
    initializeCharts() {
      this.drawChart("#chart", "Текущая эпоха");
      this.updateEpochs.forEach((epoch) => {
        this.drawChart(`#chart-${epoch}`, `Эпоха ${epoch}`);
      });
      this.drawLossChart();
    },
    drawChart(container, title) {
      const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      this.x = d3.scaleLinear().domain([0, 10]).range([0, width]);
      this.y = d3
        .scaleLinear()
        .domain([0, d3.max(this.C1)])
        .range([height, 0]);

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(this.x));

      svg.append("g").call(d3.axisLeft(this.y));

      svg
        .append("path")
        .datum(this.C1)
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .x((d, i) => this.x(this.C0[i]))
            .y((d) => this.y(d))
        );

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
    },
    drawLossChart() {
      const margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select("#loss-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleLinear()
        .domain([0, this.losses.length])
        .range([0, width]);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(this.losses)])
        .range([height, 0]);

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("path")
        .datum(this.losses)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d, i) => x(i))
            .y((d) => y(d))
        );
    },
    updateLossChart() {
      d3.select("#loss-chart").selectAll("svg").remove();
      this.drawLossChart();
    },
    async trainModel() {
      const [C0_scaled, C0_min, C0_max] = this.normalize(this.C0);
      const [C1_scaled, C1_min, C1_max] = this.normalize(this.C1);

      this.C0_min = C0_min;
      this.C0_max = C0_max;
      this.C1_min = C1_min;
      this.C1_max = C1_max;

      const model = tf.sequential();
      model.add(
        tf.layers.dense({units: 2, inputShape: [1], activation: "softplus"})
      );
      model.add(tf.layers.dense({units: 2, activation: "softplus"}));
      model.add(tf.layers.dense({units: 1}));

      let optimizer = tf.train.momentum(this.learningRate, this.momentum);

      model.compile({
        optimizer: optimizer,
        loss: "meanSquaredError",
      });

      const xs = tf.tensor2d(C0_scaled, [C0_scaled.length, 1]);
      const ys = tf.tensor2d(C1_scaled, [C1_scaled.length, 1]);

      for (let epoch = 0; epoch < this.epochCount; epoch++) {
        const history = await model.fit(xs, ys, {
          epochs: 1,
        });

        this.losses.push(history.history.loss[0]);

        if ((epoch + 1) % 500 === 0) {
          if (this.learningRate >= 0.001) {
            this.learningRate -= 0.0005;
          }
          this.momentum = Math.min(this.momentum + 0.05, 0.99);
          optimizer = tf.train.momentum(this.learningRate, this.momentum);
          model.compile({
            optimizer: optimizer,
            loss: "meanSquaredError",
          });
          console.log(
            `Epoch ${epoch + 1}: Adjusting learning rate to ${
              this.learningRate
            } and momentum to ${this.momentum}`
          );
        }

        if (this.updateEpochs.includes(epoch + 1)) {
          console.log(`Epoch ${epoch + 1}: loss = ${history.history.loss[0]}`);
          this.updateChart(model, xs, `#chart-${epoch + 1}`);
          this.updateLossChart();
        }

        this.updateChart(model, xs, `#chart`);
      }

      console.log("Finish");
      this.updateChart(model, xs, `#chart-30000`);
      this.updateLossChart();
    },
    normalize(array) {
      const min = Math.min(...array);
      const max = Math.max(...array);
      const scaled = array.map((value) => (value - min) / (max - min));
      return [scaled, min, max];
    },
    denormalize(array, min, max) {
      return array.map((value) => value * (max - min) + min);
    },
    async updateChart(model, xs, container) {
      const preds = await model.predict(xs).data();
      const predsArray = Array.from(preds);
      this.predictions = this.denormalize(predsArray, this.C1_min, this.C1_max);

      d3.select(container).selectAll(".pred-line").remove();

      const svg = d3.select(container).select("svg").select("g");

      svg
        .append("path")
        .datum(this.predictions)
        .attr("class", "pred-line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d, i) => this.x(this.C0[i]))
            .y((d) => this.y(d))
        );
    },
  },
};
</script>

<style>
#charts {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
#loss-chart {
  margin-top: 20px;
}
</style>
