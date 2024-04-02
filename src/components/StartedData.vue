<script setup lang="ts">
import { startedData } from "@/utils/data";
import { reactive } from "vue";
const data = reactive(startedData);
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
                    <td>{{ data.w1 }}</td>
                    <td>{{ data.b1 }}</td>
                    <td>{{ data.w2 }}</td>
                    <td>{{ data.b2 }}</td>
                    <td>{{ data.w13 }}</td>
                    <td>{{ data.w23 }}</td>
                    <td>{{ data.b3 }}</td>
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
