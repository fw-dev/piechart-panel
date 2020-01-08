# Piechart Panel

This is a custom piechart panel for Grafana, made by FileWave. You will need a Grafana version 6.5.* to be able to use this panel. 

To install and use the panel, there are currently two options.

1. Clone this repository into your plugin directory:

```
git clone https://github.com/fw-dev/piechart-panel.git
```

From the `piechart-panel` directory, run `yarn` and `yarn build` to build the plugin. Then restart your Grafana instance and the plugin should appear and be ready to use!

2. CDN and Docker

You can also use the panel via a CDN. To do this, clone this repository and go to the docker directory. From there, run the `run_build.sh` script. Build packages, ready to be uploaded to CDN, will be placed in `out` directory. In order to set a version that will be used for packages naming please use PIECHART_PANEL_VERSION environment variable.

## Development

To work with this plugin, run:
```
yarn dev
```

or
```
yarn watch
```

This will run linting tools and apply prettier fix.


To build the plugin, run:
```
yarn build
```

TODO:
- Improve hovering/clicking look and feel