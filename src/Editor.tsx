import React from 'react';
import { FormField, Select, Switch, SeriesColorPicker, UnitPicker } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { PanelOptions } from 'types';
import { chartOptions } from 'defaults';
import 'css/filewave-piechart-panel.css';

const RangeInput = ({ value, ...props }: any) => (
  <div className="fw-range">
    <input className="fw-range__input" value={value} type="range" {...props} />
    <span className="fw-range__value">{value}</span>
  </div>
);

export class Editor extends React.PureComponent<PanelEditorProps<PanelOptions>> {
  handleSelectChange = (option: any, name: string) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      [name]: option,
    });
  };

  handleCheckboxChange = ({ target }: any, name: string) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      [name]: target.checked,
    });
  };

  handleTextChange = ({ target }: any) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      [target.name]: target.value,
    });
  };

  handleColorPickerChange = (color: string, name: string) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      aliasColors: {
        ...options.aliasColors,
        [name]: color,
      },
    });
  };

  handleUnitChange = (format: any) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      format,
    });
  };

  generateOptions = (series: any) => series.map((serie: any) => ({ label: serie.name, value: serie.name }));

  render() {
    const { options, data } = this.props;
    return (
      <>
        <div className="section gf-form-group">
          <h5 className="section-heading">General</h5>
          <FormField
            labelWidth={10}
            label="No data message"
            type="text"
            name="dataUnavailableMessage"
            value={options.dataUnavailableMessage || ''}
            onChange={this.handleTextChange}
          />
          <FormField labelWidth={8} label="Unit" inputEl={<UnitPicker defaultValue={options.format.value} onChange={this.handleUnitChange} />} />
          <FormField
            labelWidth={10}
            label="Chart type"
            inputEl={<Select value={options.chartType} options={chartOptions.chartType} onChange={e => this.handleSelectChange(e, 'chartType')} />}
          />
          {options.chartType.value === 'doughnut' && (
            <FormField
              labelWidth={10}
              label="Cutout size"
              inputEl={<RangeInput name="cutoutPercentage" min="10" max="90" value={options.cutoutPercentage} onChange={this.handleTextChange} />}
            />
          )}
        </div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Tooltip</h5>
          <FormField
            labelWidth={10}
            label="Display tooltip"
            inputEl={<Switch label="" onChange={e => this.handleCheckboxChange(e, 'tooltipEnabled')} checked={options.tooltipEnabled} />}
          />
          <FormField
            labelWidth={10}
            label="Display colors"
            inputEl={<Switch label="" onChange={e => this.handleCheckboxChange(e, 'tooltipColorsEnabled')} checked={options.tooltipColorsEnabled} />}
          />
          <FormField
            labelWidth={10}
            label="Tooltip Title"
            type="text"
            name="tooltipTitle"
            value={options.tooltipTitle || ''}
            onChange={this.handleTextChange}
          />
          <FormField
            labelWidth={10}
            label="x Padding"
            inputEl={<RangeInput name="xPadding" min="0" max="20" value={options.xPadding} onChange={this.handleTextChange} />}
          />
          <FormField
            labelWidth={10}
            label="y Padding"
            inputEl={<RangeInput name="yPadding" min="0" max="20" value={options.yPadding} onChange={this.handleTextChange} />}
          />
        </div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Legend</h5>
          <Switch label="Display legend" onChange={e => this.handleCheckboxChange(e, 'legendEnabled')} checked={options.legendEnabled} />
          <FormField
            labelWidth={8}
            label="Position"
            inputEl={
              <Select value={options.legendPosition} options={chartOptions.position} onChange={e => this.handleSelectChange(e, 'legendPosition')} />
            }
          />
          <FormField
            labelWidth={8}
            label="Align"
            inputEl={<Select value={options.legendAlign} options={chartOptions.align} onChange={e => this.handleSelectChange(e, 'legendAlign')} />}
          />
          <Switch label="Use point style" onChange={e => this.handleCheckboxChange(e, 'legendUsePointStyle')} checked={options.legendUsePointStyle} />
          {!options.legendUsePointStyle && (
            <FormField
              labelWidth={8}
              label="Box width"
              inputEl={<RangeInput name="legendBoxWidth" min="6" max="40" value={options.legendBoxWidth} onChange={this.handleTextChange} />}
            />
          )}
          <FormField
            labelWidth={8}
            label="Font size"
            inputEl={<RangeInput name="legendFontSize" min="12" max="24" value={options.legendFontSize} onChange={this.handleTextChange} />}
          />
        </div>
        {data.series.length > 0 && (
          <div className="section gf-form-group">
            <h5 className="section-heading">Custom colors</h5>
            {data.series.map((serie: any) => (
              <FormField
                key={serie.name}
                labelWidth={12}
                label={serie.name}
                inputEl={
                  <SeriesColorPicker
                    yaxis={1}
                    color={options.aliasColors[serie.name]}
                    onChange={color => this.handleColorPickerChange(color, serie.name)}
                  >
                    {({ ref, showColorPicker, hideColorPicker }) => (
                      <div
                        ref={ref}
                        onMouseLeave={hideColorPicker}
                        onClick={showColorPicker}
                        style={{
                          backgroundColor: options.aliasColors[serie.name] || '#dde4ed',
                          marginLeft: '2px',
                          width: '35px',
                          height: '35px',
                        }}
                      />
                    )}
                  </SeriesColorPicker>
                }
              />
            ))}
          </div>
        )}
        <div className="section gf-form-group">
          <h5 className="section-heading">Link</h5>
          <Switch label="Add a link" onChange={e => this.handleCheckboxChange(e, 'linkEnabled')} checked={options.linkEnabled} />
          <FormField labelWidth={8} label="URL" name="linkUrl" type="text" onChange={this.handleTextChange} value={options.linkUrl || ''} />
          <Switch label="Open in a new tab" onChange={e => this.handleCheckboxChange(e, 'linkTargetBlank')} checked={options.linkTargetBlank} />
        </div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Highlight</h5>
          <Switch label="Display highlight" onChange={e => this.handleCheckboxChange(e, 'highlightEnabled')} checked={options.highlightEnabled} />
          <FormField
            label="Highlight"
            labelWidth={8}
            inputEl={
              <Select
                value={options.selectedHighlight}
                options={this.generateOptions(data.series)}
                onChange={e => this.handleSelectChange(e, 'selectedHighlight')}
              />
            }
          />
          <FormField
            label="Highlight value"
            labelWidth={8}
            inputEl={
              <Select
                value={options.highlightValue}
                options={chartOptions.highlightValue}
                onChange={e => this.handleSelectChange(e, 'highlightValue')}
              />
            }
          />
        </div>
      </>
    );
  }
}
