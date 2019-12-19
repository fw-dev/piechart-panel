import React from 'react';
import { PanelProps } from '@grafana/data';
// @ts-ignore
import Chart from 'chart.js';
// @ts-ignore
import TimeSeries from './TimeSeries';

import { PanelOptions, State } from './types';
import { defaultChartConfig, defaultChartData, defaultHighlight, colors } from './defaults';
import 'css/filewave-piechart-panel.css';

interface Props extends PanelProps<PanelOptions> {}

export class Panel extends React.PureComponent<Props, State> {
  private chart: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      chartData: defaultChartData,
      highlight: defaultHighlight,
    };
    this.chart = React.createRef();
  }

  componentDidMount() {
    this.handleDataFormatting(this.props.data);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { options, data } = this.props;
    const { highlight, chartData } = this.state;

    if (options !== prevProps.options) {
      this.updateChart();
    }

    if (highlight !== prevState.highlight && options.highlightEnabled) {
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
    const { selectedHighlight, highlightValue } = this.props.options;
    const { chartData } = this.state;
    const chartValues = chartData.datasets[0].data || [];
    const highlightIndex = chartData.labels.indexOf(selectedHighlight);
    const total = chartValues.reduce((x: number, y: number) => x + y, 0);
    const value = chartValues[highlightIndex] || 0;
    const percentage = `${(value / (total / 100) || 0).toFixed()}%`;

    this.setState({
      highlight: {
        value: highlightValue === 'percentage' ? percentage : value.toString(),
        label: selectedHighlight,
      },
    });
  };

  handleDataFormatting = (data: any) => {
    const timeSeries = data.series.map((serie: any) => this.createTimeSeries(serie));
    const chartData = this.formatChartData(timeSeries, data.series);
    this.setState({ chartData });
    this.drawChart();
  };

  formatChartData = (timeSeries: any, series: any) => {
    const { options } = this.props;
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

  handleClick = (_event: any, targets: any) => {
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
    const { ctx } = this.chart.chart;
    const { right, bottom } = this.chart.chart.chartArea;
    const xPos = right;
    const yPos = bottom / 2;
    this.drawText(ctx, this.props.options.dataUnavailableMessage, xPos, yPos, 18);
  };

  drawHighlight = () => {
    const { ctx } = this.chart.chart;
    const { position } = this.chart.legend;
    const { left, right, top, bottom } = this.chart.chart.chartArea;
    const { width, height } = this.chart.chart;
    const { label, value } = this.state.highlight;
    const xPos = Math.round(position === 'left' ? width + left : right);
    const yPos = (position === 'top' ? height + top : bottom) / 2;
    this.drawText(ctx, value, xPos, yPos - 5, 32);
    this.drawText(ctx, label, xPos, yPos + 25, 18);
  };

  drawText = (ctx: any, value: string, xPos: number, yPos: number, fontSize: number) => {
    ctx.restore();
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = '#BABABA';
    xPos = (xPos - ctx.measureText(value).width) / 2;
    ctx.fillText(value, xPos, yPos);
    ctx.save();
  };

  drawChart = () => {
    if (this.chart.id >= 0) {
      // Destroy the chart, otherwise it will add another one to the canvas
      this.chart.destroy();
    }
    this.chart = new Chart(this.chart.current, { ...this.updateChartSettings() });
  };

  render() {
    const { width, height } = this.props;
    return (
      <div className="fw-piechart" style={{ width, height }}>
        <canvas ref={this.chart} />
      </div>
    );
  }
}
