// @ts-ignore
import TimeSeries from './TimeSeries';
import { colors } from './defaults';

export const formatHighlightData = (timeSeries: any, options: any) => {
  const total = timeSeries.reduce((x: number, y: any) => x + y.stats.total, 0);
  const highlightData = timeSeries.map((serie: any) => {
    const percentage = `${(serie.stats[options.valueName] / (total / 100) || 0).toFixed()}%`;
    const value = serie.stats[options.valueName];
    return {
      label: serie.label,
      value: options.highlightValue === 'percentage' ? percentage : value,
    };
  });

  return highlightData;
};

export const formatChartData = (timeSeries: any, series: any, options: any) => {
  const { valueName, aliasColors } = options;
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

export const createTimeSeries = (serie: any, options: any) => {
  const timeSeries = new TimeSeries({
    datapoints: [serie.fields.map((field: any) => field.values.buffer[0])],
    alias: serie.name,
    target: serie.name,
  });
  timeSeries.flotpairs = timeSeries.getFlotPairs(options.nullPointMode);

  return timeSeries;
};

export const createUrl = (target: any, options: any) => {
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
