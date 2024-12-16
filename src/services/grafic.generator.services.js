"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChart = void 0;
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const width = 800; // width of the chart
const height = 600; // height of the chart
const chartJSNodeCanvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({ width, height });
const generateChart = (data, labels, title) => __awaiter(void 0, void 0, void 0, function* () {
    const configuration = {
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
});
exports.generateChart = generateChart;
