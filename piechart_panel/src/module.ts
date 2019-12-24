import { PanelPlugin } from '@grafana/data';
import { PanelOptions } from 'types';
import { defaultPanelOptions } from 'defaults';
import { Panel } from 'Panel';
import { Editor } from 'Editor';

export const plugin = new PanelPlugin<PanelOptions>(Panel).setDefaults(defaultPanelOptions).setEditor(Editor);
