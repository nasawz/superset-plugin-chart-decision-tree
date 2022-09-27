# superset-plugin-chart-decision-tree
# 决策树

## 定义
决策树是在已知各种情况的基础上，通过事项构建树状图，根据自己的上下级进行关联，挂接到对应的分支，常用于项目风险评估，可行性的决策分析等场景，是直观运用概率分析的一种图解法。支持展开、收起、悬停、点击等交互。支持根据当前缩放等级，节点切换详情模式与缩略模式。

## 何时使用
一般用于决策分析场景，在金融领域，用于展示资金流向、月环比、同比等，助力高管进行决策，挖掘机会，各个分支通过不同形态展示当前节点的状态，可对关键指标进行预警、监控等操作。也常用于降本增收场景，指标展示各类降本渠道、以及运营渠道，通过分析各渠道之间的关系以及实际降本额进行渠道决策。

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

To add the package to Superset, go to the `superset-frontend` subdirectory in your Superset source folder (assuming both the `superset-plugin-chart-decision-tree` plugin and `superset` repos are in the same root directory) and run
```
npm i -S ../../superset-plugin-chart-decision-tree
```

After this edit the `superset-frontend/src/visualizations/presets/MainPreset.js` and make the following changes:

```js
import { SupersetPluginChartDecisionTree } from 'superset-plugin-chart-decision-tree';
```

to import the plugin and later add the following to the array that's passed to the `plugins` property:
```js
new SupersetPluginChartDecisionTree().configure({ key: 'superset-plugin-chart-decision-tree' }),
```

After that the plugin should show up when you run Superset, e.g. the development server:

```
npm run dev-server
```





http://localhost:9000/superset/dashboard/3/?preselect_filters={"27": {"equip_id": "4"},"28": {"equip_id": "4"}}

http://localhost:9000/superset/dashboard/3/?standalone=3&show_filters=0

http://localhost:9000/superset/dashboard/3/?standalone=2&show_filters=0

http://localhost:9000/superset/dashboard/5/?expand_filters=0&standalone=3&show_filters=0&native_filters_key=BJUtmiCZCyEe7HjXy_xUH6eyoNwL9iiS0EZSPk7ESSyKt26TgJA-11BriyvOINZv