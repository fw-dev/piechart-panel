import React from 'react';
import 'jest-canvas-mock';
// @ts-ignore
import { configure, mount } from 'enzyme';
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16';
import { Panel } from './Panel';
import { defaultPanelOptions } from './defaults';

configure({ adapter: new Adapter() });

jest.mock('TimeSeries', () => {
  return jest.fn().mockImplementation(() => ({
    getFlotPairs: jest.fn(),
    stats: {},
  }));
});

const defaultProps = {
  id: 1,
  data: {
    state: 'Done',
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

describe('Piechart Panel', () => {
  describe('when doing a basic render', () => {
    // Arrange
    const component = <Panel {...defaultProps} />;
    // Act
    const mounted = mount(component);

    // Assert
    it('should render correctly', () => {
      expect(mounted).toMatchSnapshot();
    });
  });
});
