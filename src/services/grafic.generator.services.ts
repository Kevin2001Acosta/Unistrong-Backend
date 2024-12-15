import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ChartConfiguration } from "chart.js";

const width = 800; // width of the chart
const height = 600; // height of the chart
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export const generateChart = async (data: number[], labels: string[], title: string): Promise<Buffer> => {
  const configuration: ChartConfiguration = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: title,
          data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  return chartJSNodeCanvas.renderToBuffer(configuration);
};