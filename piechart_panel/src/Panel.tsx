import React from 'react';
// @ts-ignore
import Chart from 'chart.js';
// @ts-ignore
import TimeSeries from './TimeSeries';

import { State, Props } from './types';
import { defaultChartConfig, initialState, colors, defaultHighlight } from './defaults';
import 'css/filewave-piechart-panel.css';

export class Panel extends React.Component<Props, State> {
  panelId: number | undefined = this.props.data.request && this.props.data.request.panelId;
  chart: any;
  state = initialState;

  componentDidMount() {
    this.handleDataFormatting(this.props.data);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { options, data } = this.props;
    const { highlight, chartData } = this.state;

    if (options !== prevProps.options) {
      this.updateChart();
    }

    if (highlight.label !== prevState.highlight.label || options.highlightEnabled !== prevProps.options.highlightEnabled) {
      this.drawChart();
    }

    if (data !== prevProps.data || options.aliasColors !== prevProps.options.aliasColors) {
      this.handleDataFormatting(data);
    }

    if (chartData !== prevState.chartData) {
      this.updateHighlight();
    }
  }

  updateHighlight = () => {
    const { selectedHighlight } = this.props.options;
    const { highlightData } = this.state;
    const highlight = highlightData.find(highlight => highlight.label === selectedHighlight) || defaultHighlight;
    this.setState({ highlight });
  };

  handleDataFormatting = (data: any) => {
    const timeSeries = data.series.map((serie: any) => this.createTimeSeries(serie));
    const chartData = this.formatChartData(timeSeries, data.series);
    const highlightData = this.formatHighlightData(timeSeries);
    this.setState({
      chartData,
      highlightData,
    });
  };

  formatHighlightData = (timeSeries: any) => {
    const { options } = this.props;
    const total = timeSeries.reduce((x: number, y: any) => x + y.stats.total, 0);
    const { highlightValue } = this.props.options;
    const highlightData = timeSeries.map((serie: any) => {
      const percentage = `${(serie.stats[options.valueName] / (total / 100) || 0).toFixed()}%`;
      const value = serie.stats[options.valueName];
      return {
        label: serie.label,
        value: highlightValue === 'percentage' ? percentage : value,
      };
    });

    return highlightData;
  };

  formatChartData = (timeSeries: any, series: any) => {
    const { valueName, aliasColors } = this.props.options;
    const chartData = {
      labels: timeSeries.map((serie: any) => serie.alias),
      datasets: [
        {
          data: timeSeries.map((serie: any) => serie.stats[valueName]),
          backgroundColor: timeSeries.map((serie: any, i: number) => aliasColors[serie.alias] || colors[i]),
          metadata: series.map((serie: any) => serie.fields.find((field: any) => field.labels).labels),
        },
      ],
    };

    return chartData;
  };

  createTimeSeries = (serie: any) => {
    const timeSeries = new TimeSeries({
      datapoints: [serie.fields.map((field: any) => field.values.buffer[0])],
      alias: serie.name,
      target: serie.name,
    });
    timeSeries.flotpairs = timeSeries.getFlotPairs(this.props.options.nullPointMode);

    return timeSeries;
  };

  updateChartSettings = () => {
    const { options, data } = this.props;
    return {
      ...defaultChartConfig,
      data: this.state.chartData,
      type: options.chartType,
      plugins: [
        {
          afterDraw: () => {
            if (!data.series.length) {
              return this.drawDataUnavailableMessage();
            }
            if (options.highlightEnabled && options.chartType === 'doughnut') {
              return this.drawHighlight();
            }
          },
        },
      ],
      options: {
        ...defaultChartConfig.options,
        cutoutPercentage: options.chartType === 'doughnut' ? parseInt(options.cutoutPercentage, 0) : 0,
        onClick: this.handleClick,
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
    };
  };

  generateUrl = (target: any) => {
    const { linkUrl } = this.props.options;
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

  handleClick = (_event: Event, targets: any) => {
    const { options } = this.props;
    if (!options.linkEnabled || !targets.length) {
      return;
    }

    const { labels, datasets } = this.chart.data;
    const targetIndex = targets[0]._index;
    const url = this.generateUrl({
      label: labels[targetIndex],
      value: datasets[0].data[targetIndex],
      metadata: datasets[0].metadata[targetIndex],
    });

    return window.open(url, options.linkTargetBlank ? '_blank' : 'currentWindow');
  };

  updateChart = () => {
    const { options } = this.props;
    if (this.chart.config.type !== options.chartType) {
      return this.drawChart();
    }
    if (options.highlightEnabled && options.selectedHighlight) {
      this.updateHighlight();
    }
    this.chart.options = this.updateChartSettings().options;
    this.chart.update({ duration: 0 });
  };

  drawDataUnavailableMessage = () => {
    const {
      ctx,
      chartArea: { right, bottom },
    } = this.chart.chart;
    const xPos = right;
    const yPos = bottom / 2;
    this.drawText(ctx, this.props.options.dataUnavailableMessage, xPos, yPos, 18);
  };

  drawHighlight = () => {
    const {
      ctx,
      width,
      height,
      chartArea: { left, right, top, bottom },
    } = this.chart.chart;
    const { position } = this.chart.legend;
    const { label, value } = this.state.highlight;
    const xPos = Math.round(position === 'left' ? width + left : right);
    const yPos = (position === 'top' ? height + top : bottom) / 2;
    this.drawText(ctx, value, xPos, yPos - 5, 32);
    this.drawText(ctx, label, xPos, yPos + 25, 18);
  };

  drawText = (ctx: any, value: any, xPos: number, yPos: number, fontSize: number) => {
    ctx.restore();
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = '#BABABA';
    xPos = (xPos - ctx.measureText(value).width) / 2;
    ctx.fillText(value, xPos, yPos);
    ctx.save();
  };

  drawChart = () => {
    const canvas: HTMLElement | HTMLCanvasElement | null = document.getElementById(`fw-piechart-${this.panelId}`);
    if (this.chart && this.chart.id >= 0) {
      // If a chart exists, destroy it, otherwise it will add another one to the canvas
      this.chart.destroy();
    }

    if (canvas instanceof HTMLCanvasElement) {
      this.chart = new Chart(canvas.getContext('2d'), { ...this.updateChartSettings() });
    }
  };

  render() {
    const { width, height } = this.props;
    return (
      <div className="fw-piechart" style={{ width, height }}>
        <canvas id={`fw-piechart-${this.panelId}`} />
      </div>
    );
  }
}
