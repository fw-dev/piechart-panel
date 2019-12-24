rm -rf ./out/*

docker build -t filewave/piechart_panel_builder .

if [[ -z ${PIECHART_PANEL_VERSION} ]]; then
  echo "PIECHART_PANEL_VERSION environment variable not set. Defaulting to undefined."
fi

docker run -it --rm -a stdout -v "$(pwd)"/piechart_panel:/piechart_panel -v "$(pwd)"/out:/out -e PUSHPROX_VERSION="${PUSHPROX_VERSION:-undefined}" filewave/piechart_panel_builder /build.sh
