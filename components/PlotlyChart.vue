<script setup lang="ts">

import type { NuxtPlotlyConfig, NuxtPlotlyLayout } from 'nuxt-plotly';
import useChart  from '~/composables/useChart';

const { data, layout = {
  title: "",
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  xaxis: { showticklabels: false, zeroline: false, showgrid: false },
  yaxis: { showticklabels: false, zeroline: false, showgrid: false },
  margin: { l: 0, r: 0, t: 0, b: 0 },
}, config = { responsive: true, displayModeBar: false }, timePeriod = "1h" } = defineProps<{
  data: number[];
  layout?: NuxtPlotlyLayout;
  config?: NuxtPlotlyConfig;
  timePeriod?: timePeriod;
}>();

const chart = useChart(data, timePeriod);

const { chartData } = chart;


</script>

<template>
    <client-only>
      <nuxt-plotly
        v-if="data"
        :data="chartData"
        :layout
        :config
        style="width: 100%; height: 50px;"
      />
    </client-only>
</template>
  