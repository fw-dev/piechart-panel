import { PanelOptions, ChartConfig } from 'types';

export const defaultPanelOptions: PanelOptions = {
  dataUnavailableMessage: 'Data unavailable',
  chartType: 'pie',
  legendEnabled: true,
  legendPosition: 'left',
  legendAlign: 'center',
  legendBoxWidth: '40',
  legendFontSize: '12',
  legendUsePointStyle: false,
  linkEnabled: false,
  linkUrl: '',
  linkTargetBlank: true,
  highlightEnabled: true,
  highlightValue: 'percentage',
  selectedHighlight: '',
  nullPointMode: 'connected',
  valueName: 'current',
  aliasColors: {},
  cutoutPercentage: '80',
  format: 'short',
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
  },
};

export const defaultHighlight = {
  label: '',
  value: 0,
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
  highlightData: [defaultHighlight],
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
