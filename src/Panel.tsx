import React, { useRef, useEffect, useState } from 'react';
import { PanelProps } from '@grafana/data';
// @ts-ignore
import Chart from 'chart.js';

import TimeSeries from 'grafana/app/core/time_series2';
import { PanelOptions } from 'types';
import { defaultChartConfig, defaultChartData, defaultHighlight, colors } from 'defaults';
import 'css/filewave-piechart-panel.css';

interface Props extends PanelProps<PanelOptions> {}
let chart: any = null;

export const Panel = ({ options, data, width, height }: Props) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(defaultChartData);
  const [highlight, setHighlight] = useState(defaultHighlight);

  useEffect(() => {
    // Mounting
    drawChart();
  }, []);

  useEffect(() => {
    redrawChart();
  }, [options]);

  useEffect(() => {
    drawChart();
  }, [highlight, options.highlightEnabled]);

  useEffect(() => {
    handleDataChange(data);
  }, [data, options.aliasColors]);

  useEffect(() => {
    drawChart();
    updateHighlight();
  }, [chartData]);

  const updateHighlight = () => {
    const { selectedHighlight, highlightValue } = options;
    const labels = chartData.labels;
    const chartValues = chartData.datasets[0].data || [];
    const index = labels.indexOf(selectedHighlight);
    const total = chartValues.reduce((x, y) => x + y, 0);
    const value = chartValues[index] || 0;
    const percentage = `${(value / (total / 100) || 0).toFixed()}%`;

    setHighlight({
      value: highlightValue === 'percentage' ? percentage : value.toString(),
      label: selectedHighlight,
    });
  };

  const handleDataChange = (data: any) => {
    const timeSeries = data.series.map((serie: any) => createTimeSeries(serie));
    const updatedData = formatChartData(timeSeries, data.series);
    setChartData(updatedData);
    drawChart();
  };

  const formatChartData = (timeSeries: any, series: any) => {
    const { aliasColors } = options;
    const chartData = {
      labels: timeSeries.map((serie: any) => serie.alias),
      datasets: [
        {
          data: timeSeries.map((serie: any) => serie.stats[options.valueName]),
          backgroundColor: timeSeries.map((serie: any, i: number) => aliasColors[serie.alias] || colors[i]),
          metadata: series.map((serie: any) => serie.fields.find((field: any) => field.labels).labels),
        },
      ],
    };

    return chartData;
  };

  const createTimeSeries = (serie: any) => {
    const timeSeries = new TimeSeries({
      datapoints: [serie.fields.map((field: any) => field.values.buffer[0])],
      alias: serie.name,
      target: serie.name,
    });
    timeSeries.flotpairs = timeSeries.getFlotPairs(options.nullPointMode);

    return timeSeries;
  };

  const updateChartSettings = () => ({
    ...defaultChartConfig,
    data: chartData,
    type: options.chartType,
    plugins: [
      {
        afterDraw: () => {
          if (!data.series.length) {
            return drawDataUnavailableMessage();
          }
          if (options.highlightEnabled && options.chartType === 'doughnut') {
            return drawHighlight();
          }
        },
      },
    ],
    options: {
      ...defaultChartConfig.options,
      cutoutPercentage: options.chartType === 'doughnut' ? parseInt(options.cutoutPercentage, 0) : 0,
      onClick: handleClick,
      legend: {
        display: options.legendEnabled,
        position: options.legendPosition,
        align: options.legendAlign,
        labels: {
          boxWidth: parseInt(options.legendBoxWidth, 0),
          fontSize: parseInt(options.legendFontSize, 0),
          usePointStyle: options.legendUsePointStyle,
        },
      },
    },
  });

  const generateUrl = (target: any) => {
    const { linkUrl } = options;
    let url = linkUrl;
    const variableRegex = /(\${__)(.*?)(})/g; // Match anything that's written between ${__...}
    const queryVariables = Object.keys(target.metadata).map((variable: string) => ({ name: variable, value: target.metadata[variable] }));
    const vars = [...queryVariables];
    // @ts-ignore, need to look into fixing "Object is possibly null" here
    const matchedVars = linkUrl.match(variableRegex).map((variable: string) => {
      const matchedVariable = vars.find((item: any) => item.name === variable.substring(4, variable.length - 1)) || { value: '', name: '' };
      return {
        name: variable,
        value: variable.includes('targetLabel') ? target.label : variable.includes('targetValue') ? target.value : matchedVariable.value || variable,
      };
    });
    matchedVars.forEach((match: any) => (url = url.replace(match.name, match.value)));

    return url;
  };

  const handleClick = (_event: any, targets: any) => {
    if (!options.linkEnabled || !targets.length) {
      return;
    }

    const { labels, datasets } = chart.data;
    const targetIndex = targets[0]._index;
    const url = generateUrl({
      label: labels[targetIndex],
      value: datasets[0].data[targetIndex],
      metadata: datasets[0].metadata[targetIndex],
    });

    return window.open(url, options.linkTargetBlank ? '_blank' : 'currentWindow');
  };

  const redrawChart = () => {
    if (chart.config.type !== options.chartType) {
      return drawChart();
    }
    if (options.highlightEnabled && options.selectedHighlight) {
      updateHighlight();
    }
    chart.options = updateChartSettings().options;
    chart.update({ duration: 0 });
  };

  const drawDataUnavailableMessage = () => {
    const { ctx } = chart.chart;
    const { right, bottom } = chart.chart.chartArea;
    const xPos = right;
    const yPos = bottom / 2;
    drawText(ctx, options.dataUnavailableMessage, xPos, yPos, 18);
  };

  const drawHighlight = () => {
    const { ctx } = chart.chart;
    const { position } = chart.legend;
    const { left, right, top, bottom } = chart.chart.chartArea;
    const { width, height } = chart.chart;
    const { label, value } = highlight;
    const xPos = Math.round(position === 'left' ? width + left : right);
    const yPos = (position === 'top' ? height + top : bottom) / 2;
    drawText(ctx, value, xPos, yPos - 5, 32);
    drawText(ctx, label, xPos, yPos + 25, 18);
  };

  const drawText = (ctx: any, value: string, xPos: number, yPos: number, fontSize: number) => {
    ctx.restore();
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = '#BABABA';
    xPos = (xPos - ctx.measureText(value).width) / 2;
    ctx.fillText(value, xPos, yPos);
    ctx.save();
  };

  const drawChart = () => {
    if (chart !== null) {
      // Destroy the chart, otherwise it will add another one to the canvas
      chart.destroy();
    }
    chart = new Chart(chartRef.current, { ...updateChartSettings() });
  };

  return (
    <div className="fw-piechart" style={{ width, height }}>
      <canvas ref={chartRef} />
    </div>
  );
};
