# suttapitaka-chart

Interactive chart for [SuttaCentral.net](https://suttacentral.net/) using [SuttaCentral Repo Data](https://github.com/suttacentral), [D3.js](https://d3js.org/) and [OpenLayers](https://openlayers.org/).

The code for the graph is on [Observable](https://observablehq.com/@7722371e7ecac8bd/suttapitaka)

License : [CC0 Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

The final `dist`is in [gh-page branch](https://github.com/DhammaCharts/suttapitaka-chart/tree/gh-page)

To see the result : https://www.dhammacharts.org/suttapitaka-chart/

This app was built using OpenLayers + Vite. [See getting started exemple](https://openlayers.org/en/latest/doc/tutorials/bundle.html)

## Improvements

 - Use circle instead of marker
    - This might improve the click area
 - Add translation for popup
    - Need the suttaplex API to incorporate the translation title in the JSON
 - Dark mode
 - Info popup to say : **ctrl/cmd + drag** to rotate
 - FullScreen button
 - Previous button
 - Credit for dhammacharts.org
