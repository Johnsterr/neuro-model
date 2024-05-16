<template>
    <div>
        <h1>Neural Network Training</h1>
        <div id="loss-chart"></div>
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
            learningRate: 0.005,
            momentum: 0.3,
            steps: 1000,
            errors: [],
            predictions: [],
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

            const C0_scaled = this.normalize(C0);
            const C1_scaled = this.normalize(C1);

            const model = tf.sequential();
            model.add(
                tf.layers.dense({
                    units: 1,
                    inputShape: [1],
                    activation: "softplus",
                }),
            );

            model.compile({
                optimizer: tf.train.sgd(this.learningRate),
                loss: "meanAbsoluteError",
            });

            const xs = C0_scaled.reshape([100, 1]);
            const ys = C1_scaled.reshape([100, 1]);

            model
                .fit(xs, ys, {
                    epochs: this.steps,
                    callbacks: {
                        onEpochEnd: async (epoch, logs) => {
                            this.errors.push(logs.loss);
                            if (epoch % 100 === 0) {
                                console.log(`Epoch: ${epoch} Loss: ${logs.loss}`);
                                this.updateCharts();
                            }
                        },
                    },
                })
                .then(() => {
                    model
                        .predict(xs)
                        .array()
                        .then((preds) => {
                            this.predictions = preds.map((d) => d[0]);
                            this.updateCharts();
                        });
                });
        },
        normalize(tensor) {
            const min = tensor.min();
            const max = tensor.max();
            return tensor.sub(min).div(max.sub(min));
        },
        updateCharts() {
            this.drawLossChart();
            this.drawPredictionChart();
        },
        drawLossChart() {
            const margin = { top: 10, right: 30, bottom: 30, left: 60 },
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

            const x = d3.scaleLinear().domain([0, this.errors.length]).range([0, width]);
            svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

            const y = d3
                .scaleLinear()
                .domain([0, d3.max(this.errors)])
                .range([height, 0]);
            svg.append("g").call(d3.axisLeft(y));

            svg.append("path")
                .datum(this.errors)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr(
                    "d",
                    d3
                        .line()
                        .x((d, i) => x(i))
                        .y((d) => y(d)),
                );
        },
        drawPredictionChart() {
            const margin = { top: 10, right: 30, bottom: 30, left: 60 },
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

            const C0 = d3.range(0, 10, 0.1);

            const x = d3.scaleLinear().domain([0, 10]).range([0, width]);
            svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

            const y = d3
                .scaleLinear()
                .domain([0, d3.max(this.predictions)])
                .range([height, 0]);
            svg.append("g").call(d3.axisLeft(y));
            svg.append("path")
                .datum(this.predictions)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr(
                    "d",
                    d3
                        .line()
                        .x((d, i) => x(i * 0.1))
                        .y((d) => y(d)),
                );
        },
    },
};
</script>

<style>
#loss-chart,
#prediction-chart {
    margin-top: 20px;
}
</style>
