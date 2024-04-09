<script setup lang="ts">
// import { startedWeightsAndConstants2 } from "@/utils/generators";
import StartedData from "@/components/StartedData.vue";
import TableData from "@/components/TableData.vue";
import { useNeuroStore } from "@/stores/neuro";
import { computed } from "vue";

const neuroStore = useNeuroStore();

const tableData = computed(() => neuroStore.initedData);

function gen() {
    // startedWeightsAndConstants2();
    neuroStore.learnModel(tableData.value);
}
</script>

<template>
    <main>
        <button @click="gen">click</button>
        <StartedData />
        <TableData />
    </main>
</template>
