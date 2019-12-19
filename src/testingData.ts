import { defaultPanelOptions } from './defaults';

export const testData = (state?: string) => ({
  state: state || 'Done',
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
  timeRange: '',
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
