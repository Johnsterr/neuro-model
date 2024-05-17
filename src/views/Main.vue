<script setup lang="ts">
import { computed } from "vue";
import StartedData from "@/components/StartedData.vue";
import TableData from "@/components/TableData.vue";
import { useNeuroStore } from "@/stores/neuro";

const neuroStore = useNeuroStore();

function gen() {
    neuroStore.learnModel();
}

function stop() {
    neuroStore.stopLearn();
}
</script>

<template>
    <main>
        <button @click="gen">click</button>
        <button @click="stop">stop</button>
        <StartedData />
        <TableData />
    </main>
</template>
