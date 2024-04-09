<script setup lang="ts">
import { computed } from "vue";
import StartedData from "@/components/StartedData.vue";
import TableData from "@/components/TableData.vue";
import { useNeuroStore } from "@/stores/neuro";

const neuroStore = useNeuroStore();

const tableData = computed(() => neuroStore.initedData);

function gen() {
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
