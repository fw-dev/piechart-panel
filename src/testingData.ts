import { defaultPanelOptions } from './defaults';

export const testData = (state?: string) => ({
  state: state || 'Done',
  error: undefined,
  timeRange: {},
  request: {
    cacheTimeout: null,
    dashboardId: 11,
    endTime: 1577184404002,
    interval: '1m',
    intervalMs: 60000,
    maxDataPoints: 449,
    panelId: 2,
    rangeRaw: {
      from: 'now-6h',
      to: 'now',
    },
    requestId: 'Q100',
    startTime: 1577184403903,
    scopedVars: {
      __interval: {
        text: '1m',
        value: '1m',
      },
      __interval_ms: {
        text: '60000',
        value: 60000,
      },
    },
    range: {},
    targets: [
      {
        datasource: 'FileWave Prometheus',
        expr: 'go_memstats_alloc_bytes_total',
        instant: true,
        legendFormat: '{{job}}',
        refId: 'A',
        requestId: '2A',
      },
    ],
    timeInfo: '',
    timezone: 'browser',
  },
  series: [
    {
      fields: [
        {
          calcs: null,
          config: { unit: undefined },
          labels: { __name__: 'go_memstats_alloc_bytes_total', instance: 'localhost:20448', job: 'grafana' },
          name: 'grafana',
          type: 'number',
          values: {
            buffer: [1078024840],
          },
        },
      ],
      length: 1,
      meta: undefined,
      name: 'grafana',
      refId: 'A',
    },
  ],
});

export const defaultProps = {
  id: 1,
  data: {
    ...testData(),
  },
  timeRange: '',
  timeZone: '',
  options: {
    ...defaultPanelOptions,
    aliasColors: {},
  },
  onOptionsChange: jest.fn(),
  renderCounter: null,
  transparent: false,
  width: 500,
  height: 500,
  replaceVariables: jest.fn(),
  onChangeTime: jest.fn(),
  onChangeTimeRange: jest.fn(),
};
