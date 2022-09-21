# superset-plugin-chart-hello-world

This is the Superset Plugin Chart Hello World Superset Chart Plugin.

### Usage

To build the plugin, run the following commands:

```
npm ci
npm run build
```

Alternatively, to run the plugin in development mode (=rebuilding whenever changes are made), start the dev server with the following command:

```
npm run dev
```

To add the package to Superset, go to the `superset-frontend` subdirectory in your Superset source folder (assuming both the `superset-plugin-chart-hello-world` plugin and `superset` repos are in the same root directory) and run
```
npm i -S ../../superset-plugin-chart-hello-world
```

After this edit the `superset-frontend/src/visualizations/presets/MainPreset.js` and make the following changes:

```js
import { SupersetPluginChartHelloWorld } from 'superset-plugin-chart-hello-world';
```

to import the plugin and later add the following to the array that's passed to the `plugins` property:
```js
new SupersetPluginChartHelloWorld().configure({ key: 'superset-plugin-chart-hello-world' }),
```

After that the plugin should show up when you run Superset, e.g. the development server:

```
npm run dev-server
```





http://localhost:9000/superset/dashboard/3/?preselect_filters={"27": {"equip_id": "4"},"28": {"equip_id": "4"}}

http://localhost:9000/superset/dashboard/3/?standalone=3&show_filters=0

http://localhost:9000/superset/dashboard/3/?standalone=2&show_filters=0

http://localhost:9000/superset/dashboard/5/?expand_filters=0&standalone=3&show_filters=0&native_filters_key=BJUtmiCZCyEe7HjXy_xUH6eyoNwL9iiS0EZSPk7ESSyKt26TgJA-11BriyvOINZv