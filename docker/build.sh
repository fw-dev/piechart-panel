#!/bin/bash
set -ex

mkdir /out/piechart_panel-"${PIECHART_PANEL_VERSION:-undefined}"

cd /piechart_panel
ls -la
yarn
yarn build
mv ./dist/* /out/piechart_panel-"${PIECHART_PANEL_VERSION:-undefined}"
rm -rf node_modules

cd /out
tar -zcvf piechart_panel-"${PIECHART_PANEL_VERSION:-undefined}".tar.gz piechart_panel-"${PIECHART_PANEL_VERSION:-undefined}"
