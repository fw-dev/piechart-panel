import { PanelOptions, ChartConfig } from 'types';

export const defaultPanelOptions: PanelOptions = {
  dataUnavailableMessage: 'Data unavailable',
  chartType: { label: 'Pie', value: 'pie' },
  legendEnabled: true,
  legendPosition: { label: 'Left', value: 'left' },
  legendAlign: { label: 'Center', value: 'center' },
  legendBoxWidth: '40',
  legendFontSize: '12',
  legendUsePointStyle: false,
  linkEnabled: false,
  linkUrl: '',
  linkTargetBlank: true,
  highlightEnabled: false,
  highlightValue: { label: 'Percentage', value: 'percentage' },
  selectedHighlight: { label: '', value: '' },
  nullPointMode: 'connected',
  valueName: 'current',
  aliasColors: {},
  cutoutPercentage: '80',
  format: { value: 'short', label: 'short' },
  tooltipTitle: '',
  tooltipEnabled: true,
  tooltipColorsEnabled: true,
  xPadding: 6,
  yPadding: 6,
};

export const defaultChartConfig: ChartConfig = {
  type: 'pie',
  options: {
    cutoutPercentage: 80,
    responsive: true,
    aspectRatio: 1,
    maintainAspectRatio: false,
    animation: {
      animateRotate: false,
    },
    tooltips: {
      enabled: true,
      displayColors: true,
      xPadding: 6,
      yPadding: 6,
      callbacks: {
        title: () => '',
      },
    },
  },
};

export const defaultHighlight = {
  label: '',
  value: '',
};

export const initialState = {
  chartData: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  },
  highlight: defaultHighlight,
  highlightData: {
    series: [defaultHighlight],
    fallback: defaultHighlight,
  },
};

export const chartOptions = {
  position: [
    { label: 'top', value: 'top' },
    { label: 'left', value: 'left' },
    { label: 'bottom', value: 'bottom' },
    { label: 'right', value: 'right' },
  ],
  align: [
    { label: 'start', value: 'start' },
    { label: 'center', value: 'center' },
    { label: 'end', value: 'end' },
  ],
  chartType: [
    { label: 'Pie', value: 'pie' },
    { label: 'Doughnut', value: 'doughnut' },
  ],
  highlightValue: [
    { label: 'Percentage', value: 'percentage' },
    { label: 'Number', value: 'number' },
  ],
};

export const colors = ['#96D98D', '#8AB8FF', '#EB4034', '#EBDC34'];
