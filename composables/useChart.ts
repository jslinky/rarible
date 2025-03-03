import { computed } from "vue";
import type { Ref } from "vue";
import type { NuxtPlotlyData } from "nuxt-plotly";

export default function useChart(data: number[], timePeriod: timePeriod) {

    const tradingDirection = computed(() => {
        const start = data[0];
        const end = data[data.length - 1];
        const color = end < start ? "hsl(347, 77%, 50%)" : "hsl(125, 64%, 44%)";
        const direction = end < start ? "down" : "up";
        return {
            color,
            direction
        }
    });
    
    const averageOverWindow = (data: number[], windowSize: number): number[] => {
        if (windowSize <= 0) {
            throw new Error("Window size must be greater than 0");
        }
        
        const result: number[] = [];
        for (let i = 0; i < data.length; i += windowSize) {
            const window = data.slice(i, i + windowSize);
            const avg = window.reduce((sum, num) => sum + num, 0) / window.length;
            result.push(avg);
        }
        
        return result;
    }
    
    const windowSize = computed(() => {
        switch (timePeriod) {
            case "1h":
                return 12;
            case "6h":
                return 6;
            case "24h":
                return 24;
            case "7d":
                return 7;
            case "30d":
                return 30;
            default:
                return 12;
        }
    });
    
    const filteredData = computed(() => averageOverWindow(data, windowSize.value));
    
    
    const chartData: Ref<NuxtPlotlyData> = computed(() => [
      {
        x: Array.from({ length: windowSize.value }, (_, i) => i + 1),
        y: filteredData.value,
        type: "scatter",
        mode: "lines",
        line: { color: tradingDirection.value.color, width: 2 },
        hoverinfo: "skip",
        showlegend: false,
      },
    ]);


    return {
        tradingDirection,
        averageOverWindow,
        windowSize,
        filteredData,
        chartData,
    };


}