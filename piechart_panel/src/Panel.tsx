import React from 'react';
// @ts-ignore
import Chart from 'chart.js';

import { State, Props } from './types';
import { defaultChartConfig, initialState, defaultHighlight } from './defaults';
import { formatChartData, formatHighlightData, createTimeSeries, createUrl } from './utils';
import 'css/filewave-piechart-panel.css';

export class Panel extends React.Component<Props, State> {
  panelId: number | undefined = this.props.data.request && this.props.data.request.panelId;
  chart: any;
  state = initialState;

  componentDidMount() {
    this.handleDataFormatting(this.props.data);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { options: { highlightEnabled, aliasColors }, data } = this.props;
    const { highlight, chartData } = this.state;

    if (this.props.options !== prevProps.options) {
      this.updateChart();
    }

    if (chartData !== prevState.chartData) {
      this.updateHighlight();
    }

    if (highlight.label !== prevState.highlight.label || highlightEnabled !== prevProps.options.highlightEnabled) {
      this.drawChart();
    }

    if (data !== prevProps.data || aliasColors !== prevProps.options.aliasColors) {
      this.handleDataFormatting(data);
    }
  }

  updateHighlight = () => {
    const { selectedHighlight } = this.props.options;
    const { highlightData } = this.state;
    const highlight = highlightData.find(highlight => highlight.label === selectedHighlight) || defaultHighlight;
    this.setState({ highlight });
  };

  handleDataFormatting = (data: any) => {
    const { options } = this.props;
    const timeSeries = data.series.map((serie: any) => createTimeSeries(serie, options));
    const chartData = formatChartData(timeSeries, data.series, options);
    const highlightData = formatHighlightData(timeSeries, options);
    this.setState({
      chartData,
      highlightData,
    }, () => this.drawChart());
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

  handleClick = (_event: Event, targets: any) => {
    const { options } = this.props;
    if (!options.linkEnabled || !targets.length) {
      return;
    }

    const { labels, datasets } = this.chart.data;
    const targetIndex = targets[0]._index;
    const url = createUrl({
      label: labels[targetIndex],
      value: datasets[0].data[targetIndex],
      metadata: datasets[0].metadata[targetIndex],
    }, options);

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
