import React from 'react';
import { FormField, Select, Switch, SeriesColorPicker } from '@grafana/ui';
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
      [name]: option.value,
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

  generateOptions = (series: any) => series.map((serie: any) => ({ label: serie.name, value: serie.name }));

  render() {
    const { options, data } = this.props;
    return (
      <>
        <div className="section gf-form-group">
          <h5 className="section-heading">General</h5>
          <FormField labelWidth={8} label="Data unavailable message" type="text" name="dataUnavailableMessage" value={options.dataUnavailableMessage || ''} onChange={this.handleTextChange} />
          <FormField
            labelWidth={8}
            label="Chart type"
            inputEl={
              <Select defaultValue={options.chartType} options={chartOptions.chartType} onChange={e => this.handleSelectChange(e, 'chartType')} />
            }
          />
          {options.chartType === 'doughnut' && (
            <FormField
              labelWidth={8}
              label="Cutout size"
              inputEl={<RangeInput name="cutoutPercentage" min="10" max="90" value={options.cutoutPercentage} onChange={this.handleTextChange} />}
            />
          )}
        </div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Legend</h5>
          <Switch label="Display legend" onChange={e => this.handleCheckboxChange(e, 'legendEnabled')} checked={options.legendEnabled} />
          <FormField
            labelWidth={8}
            label="Position"
            inputEl={
              <Select
                defaultValue={options.legendPosition}
                options={chartOptions.position}
                onChange={e => this.handleSelectChange(e, 'legendPosition')}
              />
            }
          />
          <FormField
            labelWidth={8}
            label="Align"
            inputEl={
              <Select defaultValue={options.legendAlign} options={chartOptions.align} onChange={e => this.handleSelectChange(e, 'legendAlign')} />
            }
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
            inputEl={<Select options={this.generateOptions(data.series)} onChange={e => this.handleSelectChange(e, 'selectedHighlight')} />}
          />
          <FormField
            label="Highlight value"
            labelWidth={8}
            inputEl={<Select options={chartOptions.highlightValue} onChange={e => this.handleSelectChange(e, 'highlightValue')} />}
          />
        </div>
      </>
    );
  }
}
