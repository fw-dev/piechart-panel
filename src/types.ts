import { PanelProps } from '@grafana/data';

export interface Props extends PanelProps<PanelOptions> {}

export interface PanelOptions {
  dataUnavailableMessage: string;
  legendEnabled: boolean;
  legendBoxWidth: string;
  legendFontSize: string;
  legendUsePointStyle: boolean;
  linkEnabled: boolean;
  linkUrl: string;
  linkTargetBlank: boolean;
  highlightEnabled: boolean;
  nullPointMode: string;
  valueName: string;
  cutoutPercentage: string;
  tooltipTitle: string;
  tooltipEnabled: boolean;
  tooltipColorsEnabled: boolean;
  xPadding: number;
  yPadding: number;
  aliasColors: {
    [key: string]: string;
  };
  chartType: {
    label: string;
    value: string;
  };
  legendPosition: {
    label: string;
    value: string;
  };
  legendAlign: {
    label: string;
    value: string;
  };
  highlightValue: {
    label: string;
    value: string;
  };
  selectedHighlight: {
    label: string;
    value: string;
  };
  format: {
    label: string;
    value: string;
  };
}

export interface ChartConfig {
  type: string;
  options: {
    responsive: boolean;
    aspectRatio: number;
    maintainAspectRatio: boolean;
    cutoutPercentage: number;
    animation: {
      animateRotate: boolean;
    };
    tooltips: {
      enabled: boolean;
      displayColors: boolean;
      xPadding: number;
      yPadding: number;
      callbacks: {
        title: () => string;
      };
    };
  };
}

export interface State {
  chartData: ChartData;
  highlight: Highlight;
  highlightData: Highlight[];
}

export interface DataSet {
  data: number[];
  backgroundColor: string[];
}

export interface ChartData {
  labels: string[];
  datasets: DataSet[];
}

export interface Highlight {
  label: string;
  value: string | number;
}
