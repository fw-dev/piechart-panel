import { PanelOptions, ChartConfig, ChartData, Highlight } from 'types';

export const defaultPanelOptions: PanelOptions = {
  title: 'Title',
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

export const defaultChartData: ChartData = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
    },
  ],
};

export const defaultHighlight: Highlight = {
  value: '',
  label: '',
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
  highlight: [
    { label: 'test', value: 'test' },
    { label: 'hallo', value: 'hallo' },
  ],
  highlightValue: [
    { label: 'Percentage', value: 'percentage' },
    { label: 'Number', value: 'number' },
  ],
};

export const colors = ['#96D98D', '#8AB8FF', '#EB4034', '#EBDC34'];
