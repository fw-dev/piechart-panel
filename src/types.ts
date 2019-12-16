export interface IPanelOptions {
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

export interface IChartConfig {
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

export interface IDataSet {
  data: Array<number>;
  backgroundColor: Array<string>;
}

export interface IChartData {
  labels: Array<string>;
  datasets: Array<IDataSet>;
}

export interface IHighlight {
  label: string;
  value: string;
}
