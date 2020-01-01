import React from 'react';
import 'jest-canvas-mock';
// @ts-ignore
import { configure, mount } from 'enzyme';
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16';
import { Panel } from './Panel';
import { defaultProps, testData } from './testingData';

configure({ adapter: new Adapter() });

jest.mock('grafanaUtils', () => {
  return {
    TimeSeries: jest.fn().mockImplementation(() => ({
      getFlotPairs: jest.fn(),
      stats: {},
    })),
    kbn: jest.fn(),
  };
});

describe('Piechart Panel', () => {
  describe('when doing a basic render with data', () => {
    // Arrange
    const component = <Panel {...defaultProps} />;

    // Act
    const mounted = mount(component);

    // Assert
    it('should render correctly', () => {
      expect(mounted).toMatchSnapshot();
    });
  });

  describe('when the panel options are being updated', () => {
    // Arrange
    const component = <Panel {...defaultProps} />;
    const mounted = mount(component);
    const instance = mounted.instance();
    const updateChart = jest.fn();
    instance.updateChart = updateChart;

    // Act
    mounted.setProps({
      ...defaultProps,
      options: {
        ...defaultProps.options,
        chartType: 'doughnut',
      },
    });

    // Assert
    it('should call the updateChart method', () => {
      expect(updateChart).toHaveBeenCalled();
    });
  });

  describe('when the incoming data is being updated', () => {
    // Arrange
    const component = <Panel {...defaultProps} />;
    const mounted = mount(component);
    const instance = mounted.instance();
    const handleDataFormatting = jest.fn();
    instance.handleDataFormatting = handleDataFormatting;

    // Act
    mounted.setProps({
      ...defaultProps,
      data: testData('Loading'),
    });

    // Assert
    it('should call the handleDataFormatting method', () => {
      expect(handleDataFormatting).toHaveBeenCalled();
    });
  });
});
