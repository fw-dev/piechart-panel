// @ts-ignore
import { TimeSeries, kbn } from './grafanaUtils';
import { colors } from './defaults';

export const formatHighlightData = (timeSeries: any, options: any) => {
  const { valueName, highlightValue, selectedHighlight, format } = options;
  const total = timeSeries.reduce((x: number, y: any) => x + y.stats.total, 0);
  const series = timeSeries.map((serie: any) => {
    const percentage = `${(serie.stats[options.valueName] / (total / 100) || 0).toFixed()}%`;
    const value = serie.stats[valueName];
    return {
      label: serie.label,
      value: highlightValue.value === 'percentage' ? percentage : formatValue(value, format.value),
    };
  });

  return {
    series,
    fallback: {
      label: selectedHighlight.label,
      value: `0${highlightValue.value === 'percentage' ? '%' : formatValue(0, format.value)}`,
    },
  };
};

export const mergeAliases = (series: any, aliasColors: any) => {
  const aliasesFromSettings = Object.keys(aliasColors);
  const aliasesFromData = series.map((serie: any) => serie.alias).filter((alias: string) => alias !== undefined);

  return [...new Set([...aliasesFromData, ...aliasesFromSettings])];
};

export const formatChartData = (timeSeries: any, series: any, options: any) => {
  const { valueName, aliasColors } = options;
  const labels = mergeAliases(timeSeries, aliasColors);
  const data = labels.map((_label: string, i: number) => (timeSeries[i] ? timeSeries[i].stats[valueName] : 0));
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: labels.map((label: any, i: number) => aliasColors[label] || colors[i]),
        metadata: series.map((serie: any) => serie.fields.find((field: any) => field.labels).labels || {}),
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
  const linkUrlVariables = linkUrl.match(variableRegex) || [];

  const matchedVariables = linkUrlVariables.length
    ? linkUrlVariables.map((variable: string) => {
        const matchedVariable = queryVariables.find((item: any) => item.name === variable.substring(4, variable.length - 1)) || {
          value: '',
          name: '',
        };
        return {
          name: variable,
          value: variable.includes('targetLabel')
            ? target.label
            : variable.includes('targetValue')
            ? target.value
            : matchedVariable.value || variable,
        };
      })
    : [];

  matchedVariables.forEach((match: any) => (url = url.replace(match.name, match.value)));

  return url;
};

// taken from https://github.com/grafana/piechart-panel
const getDecimalsForValue = (value: any) => {
  const delta = value / 2;
  let dec = -Math.floor(Math.log(delta) / Math.LN10);

  const magn = Math.pow(10, -dec);
  const norm = delta / magn; // norm is between 1.0 and 10.0
  let size;

  if (norm < 1.5) {
    size = 1;
  } else if (norm < 3) {
    size = 2;
    // special case for 2.5, requires an extra decimal
    if (norm > 2.25) {
      size = 2.5;
      ++dec;
    }
  } else if (norm < 7.5) {
    size = 5;
  } else {
    size = 10;
  }

  size *= magn;

  // reduce starting decimals if not needed
  if (Math.floor(value) === value) {
    dec = 0;
  }

  const result = {
    decimals: 0,
    scaledDecimals: 0,
  };
  result.decimals = Math.max(0, dec);
  result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

  return result;
};

export const formatValue = (value: any, format: string) => {
  const decimalInfo = getDecimalsForValue(value);
  const formatFunc = kbn.valueFormats[format];
  if (formatFunc) {
    return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
  }
  return value;
};
