import { PanelPlugin } from '@grafana/data';
import { IPanelOptions } from 'types';
import { defaultPanelOptions } from 'defaults';
import { Panel } from 'Panel';
import { Editor } from 'Editor';

export const plugin = new PanelPlugin<IPanelOptions>(Panel).setDefaults(defaultPanelOptions).setEditor(Editor);
