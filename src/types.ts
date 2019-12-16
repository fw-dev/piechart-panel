export interface PanelOptions {
  title: string;
  chartType: string;
  legendEnabled: boolean;
  legendPosition: string;
  legendAlign: string;
  legendBoxWidth: string;
  legendFontSize: string;
  legendUsePointStyle: boolean;
  linkEnabled: boolean;
  linkUrl: string;
  linkTargetBlank: boolean;
  highlightEnabled: boolean;
  highlightValue: string;
  selectedHighlight: string;
  nullPointMode: string;
  valueName: string;
  aliasColors: object;
  cutoutPercentage: string;
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
  };
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
  value: string;
}
