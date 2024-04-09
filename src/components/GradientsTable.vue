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
                    <!-- <td>Производная Y`1</td>
                    <td>Производная Y`2</td>
                    <td>Нормализованное C*0</td>
                    <td>Нормализованное C*1</td>
                    <td>Аргумент X1</td>
                    <td>Аргумент X2</td>
                    <td>Значение Y1</td>
                    <td>Значение Y2</td>
                    <td>Расчетное C1* Calc</td>
                    <td>Расчетное C1 Calc</td> -->
                </tr>
            </thead>
            <tbody>
                <template v-for="item in calculatedData">
                    <tr>
                        <td>{{ item.w1 }}</td>
                        <td>{{ item.deltaW1 }}</td>
                        <td>{{ item.newW1 }}</td>
                        <!-- <td>{{ item.c1Normalize }}</td>
                        <td>{{ item.x1 }}</td>
                        <td>{{ item.x2 }}</td>
                        <td>{{ item.y1 }}</td>
                        <td>{{ item.y2 }}</td>
                        <td>{{ item.c1calcNorm }}</td>
                        <td>{{ item.c1calc }}</td> -->
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>
