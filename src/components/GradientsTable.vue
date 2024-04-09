<script setup lang="ts">
import { computed } from "vue";
import { useNeuroStore } from "@/stores/neuro";

const neuroStore = useNeuroStore();

const calculatedData = computed(() => neuroStore.calculatedData);
</script>
<template>
    <div>
        <h3>Расчеты</h3>
        <table>
            <thead>
                <tr>
                    <td>Входной w1</td>
                    <td>Дельта w1</td>
                    <td>Новый w1</td>
                    <td>Входной b1</td>
                    <td>Дельта b1</td>
                    <td>Новый b1</td>
                    <td>Входной w2</td>
                    <td>Дельта w2</td>
                    <td>Новый w2</td>
                    <td>Входной b2</td>
                    <td>Дельта b2</td>
                    <td>Новый b2</td>
                    <td>Входной w13</td>
                    <td>Дельта w13</td>
                    <td>Новый w13</td>
                    <td>Входной w23</td>
                    <td>Дельта w23</td>
                    <td>Новый w23</td>
                    <td>Входной b3</td>
                    <td>Дельта b3</td>
                    <td>Новый b3</td>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in calculatedData">
                    <tr>
                        <td>{{ item.w1 }}</td>
                        <td>{{ item.deltaW1 }}</td>
                        <td>{{ item.newW1 }}</td>
                        <td>{{ item.b1 }}</td>
                        <td>{{ item.deltaB1 }}</td>
                        <td>{{ item.newB1 }}</td>
                        <td>{{ item.w2 }}</td>
                        <td>{{ item.deltaW2 }}</td>
                        <td>{{ item.newW2 }}</td>
                        <td>{{ item.b2 }}</td>
                        <td>{{ item.deltaB2 }}</td>
                        <td>{{ item.newB2 }}</td>
                        <td>{{ item.w13 }}</td>
                        <td>{{ item.deltaW13 }}</td>
                        <td>{{ item.newW13 }}</td>
                        <td>{{ item.w23 }}</td>
                        <td>{{ item.deltaW23 }}</td>
                        <td>{{ item.newW23 }}</td>
                        <td>{{ item.b3 }}</td>
                        <td>{{ item.deltaB3 }}</td>
                        <td>{{ item.newB3 }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>
