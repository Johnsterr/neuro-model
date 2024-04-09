<script setup lang="ts">
import { computed } from "vue";
import { useNeuroStore } from "@/stores/neuro";

const neuroStore = useNeuroStore();
const currentWeightsAndRatios = computed(() => neuroStore.currentWeightsAndRatios);
</script>

<template>
    <div class="current-data">
        <h3>Текущие веса и коэффициенты</h3>
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
                    <td>{{ currentWeightsAndRatios.w1 }}</td>
                    <td>{{ currentWeightsAndRatios.b1 }}</td>
                    <td>{{ currentWeightsAndRatios.w2 }}</td>
                    <td>{{ currentWeightsAndRatios.b2 }}</td>
                    <td>{{ currentWeightsAndRatios.w13 }}</td>
                    <td>{{ currentWeightsAndRatios.w23 }}</td>
                    <td>{{ currentWeightsAndRatios.b3 }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.data-wrapper {
    /* max-width: 500px; */
}
</style>
