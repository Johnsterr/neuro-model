<script setup lang="ts">
import { computed } from "vue";
import { useNeuroStore } from "@/stores/neuro";

const neuroStore = useNeuroStore();
const startedWeightsAndRatios = computed(() => neuroStore.startedWeightsAndRatios);
</script>

<template>
    <div class="started-data">
        <h3>Начальные веса и коэффициенты</h3>
        <table>
            <thead>
                <tr>
                    <td>w1</td>
                    <td>b1</td>
                    <td>w2</td>
                    <td>b2</td>
                    <td>w13</td>
                    <td>w23</td>
                    <td>b3</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ startedWeightsAndRatios.w1 }}</td>
                    <td>{{ startedWeightsAndRatios.b1 }}</td>
                    <td>{{ startedWeightsAndRatios.w2 }}</td>
                    <td>{{ startedWeightsAndRatios.b2 }}</td>
                    <td>{{ startedWeightsAndRatios.w13 }}</td>
                    <td>{{ startedWeightsAndRatios.w23 }}</td>
                    <td>{{ startedWeightsAndRatios.b3 }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.started-data {
    /* max-width: 500px; */
}
</style>
