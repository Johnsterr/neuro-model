<script setup lang="ts">
import { computed } from "vue";
import { useNeuroStore } from "@/stores/neuro";

const neuroStore = useNeuroStore();

const tableData = computed(() => neuroStore.calcData);
</script>
<template>
    <div>
        <h3>Расчеты</h3>
        <table>
            <thead>
                <tr>
                    <td>Вход C0</td>
                    <td>Выход C1</td>
                    <td>Нормализованное C*0</td>
                    <td>Нормализованное C*1</td>
                    <td>Аргумент X1</td>
                    <td>Аргумент X2</td>
                    <td>Значение Y1</td>
                    <td>Значение Y2</td>
                    <td>Расчетное C1* Calc</td>
                    <td>Расчетное C1 Calc</td>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in tableData">
                    <tr>
                        <td>{{ item.c0 }}</td>
                        <td>{{ item.c1 }}</td>
                        <td>{{ item.c0Normalize }}</td>
                        <td>{{ item.c1Normalize }}</td>
                        <td>{{ item.x1 }}</td>
                        <td>{{ item.x2 }}</td>
                        <td>{{ item.y1 }}</td>
                        <td>{{ item.y2 }}</td>
                        <td>{{ item.c1calcNorm }}</td>
                        <td>{{ item.c1calc }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>
