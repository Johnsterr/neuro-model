<script setup lang="ts">
// import { startedData } from "@/utils/data";
// import { reactive } from "vue";
// const data = reactive(startedData);
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
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
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
