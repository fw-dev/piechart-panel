# Piechart Panel

This is a piechart panel based on React and chartjs library for Grafana, created by FileWave.

- Each segment on piechart is clickable and can be linked to a url.
- Customizable highlight of the donut chart wil show the most important number.


## Requirements 
- Grafana version 6.5.0 or above

## Installation methods

To install and use the panel, there are currently two options.

1. Grab the latest release, extract package and put it in your grafana's plugins directory.

2. Clone this repository into your plugin directory:

```
git clone https://github.com/fw-dev/piechart-panel.git
```

From the `piechart-panel` directory, run `yarn` and `yarn build` to build the plugin. Then restart your Grafana instance and the plugin should appear and be ready to use!

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

## Docker

You can also use docker to build piechart panel, just go to docker directory and run 
```
PIECHART_PANEL_VERSION=1.0.0 run_build.sh
```
A docker container will build and test everything and the output will be in docker/out directory for easy use.

### TODO:
- Improve hovering/clicking look and feel