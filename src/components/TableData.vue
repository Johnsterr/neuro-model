<script setup lang="ts">
import { useNeuroStore } from "@/stores/neuro";

const neuroStore = useNeuroStore();
</script>
<template>
    <table>
        <thead>
            <tr>
                <td>Вход С0</td>
                <td>Выход С1</td>
                <td>Нормализованное С0</td>
                <td>Нормализованное С1</td>
                <td>Аргумент X1</td>
                <td>Аргумент X2</td>
                <td>Значение Y1</td>
                <td>Значение Y2</td>
            </tr>
        </thead>
        <tbody>
            <template v-for="item in neuroStore.data">
                <tr>
                    <td>{{ item.c0 }}</td>
                    <td>{{ item.c1 }}</td>
                    <td>{{ item.c0Normalize }}</td>
                    <td>{{ item.c1Normalize }}</td>
                    <td>{{ item.x1 }}</td>
                    <td>{{ item.x2 }}</td>
                    <td>{{ item.y1 }}</td>
                    <td>{{ item.y2 }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>
