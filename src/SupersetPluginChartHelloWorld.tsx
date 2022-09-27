/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect, createRef, useRef, useState } from 'react';
import { styled } from '@superset-ui/core';
// import { Button } from '@superset-ui/core';
import { SupersetPluginChartDecisionTreeProps, SupersetPluginChartDecisionTreeStylesProps } from './types';

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts
// padding: ${({ theme }) => theme.gridUnit * 4}px;
const Styles = styled.div<SupersetPluginChartDecisionTreeStylesProps>`
  
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

import G6 from '@antv/g6';

import registerShape from "./cost_tree/shape";
registerShape(G6);
const mockData = {
  id: "g1",
  name: "总成本",
  count: 18134,
  children: [
    {
      id: "g11",
      name: "直接成本",
      count: 12442,
      children: [
        {
          id: "g111",
          name: "人员成本",
          count: 8442,
          children: [
            {
              id: "g1111",
              name: "工资",
              count: 5442,
            },
            {
              id: "g1112",
              name: "奖金",
              count: 442,
            },
            {
              id: "g1113",
              name: "补贴",
              count: 105,
            },
          ],
        },
        {
          id: "g112",
          name: "材料成本",
          count: 2442,
        },
        {
          id: "g113",
          name: "固定资产折旧",
          count: 0,
        },
        {
          id: "g114",
          name: "其他成本",
          count: 1402,
        },
      ],
    },
    {
      id: "g12",
      name: "间接成本",
      count: 5150,
      children: [
        {
          id: "g121",
          name: "科室直接成本分摊",
          count: 5150,
          children: [
            {
              id: "g1211",
              name: "人员成本",
              count: 5150,
            },
            {
              id: "g1212",
              name: "其他成本",
              count: 5150,
            },
          ],
        },
        {
          id: "g122",
          name: "科室间接成本分摊",
          count: 0,
        },
      ],
    },
  ],
};
/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginChartDecisionTree(props: SupersetPluginChartDecisionTreeProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width, onChange } = props;
  // console.log('----------------------', data, onChange);
  // this.props.onChange(selectedValues, false);

  const rootElem = createRef<HTMLDivElement>();
  const [sgraph, setSGraph]: any = useState(null)
  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {

    const container = rootElem.current as HTMLElement;
    // console.log('Plugin element', container);

    const defaultConfig = {
      width,
      height,
      modes: {
        default: ["zoom-canvas", "drag-canvas"],
      },
      // fitView: true,
      // fitViewPadding:[ 0, 0, 0, 0],
      // fitCenter:false,
      animate: true,
      defaultNode: {
        type: "flow-rect",
      },
      defaultEdge: {
        type: "cubic-horizontal",
        style: {
          stroke: "#CED4D9",
        },
      },
      layout: {
        type: "indented",
        direction: "LR",
        dropCap: false,
        indent: 300,
        getHeight: () => {
          return 60;
        },
      }
    };

    const graph = new G6.TreeGraph({
      container: container,
      ...defaultConfig,
      // plugins: [tooltip],
    });
    graph.data(data);
    graph.render();
    graph.translate(110, 60);

    const handleCollapse = (e) => {
      const target = e.target;
      const id = target.get("modelId");
      const item = graph.findById(id);
      const nodeModel = item.getModel();
      nodeModel.collapsed = !nodeModel.collapsed;
      graph.layout();
      graph.setItemState(item, "collapse", nodeModel.collapsed == true);
    };

    graph.on("collapse-text:click", (e) => {
      handleCollapse(e);
    });
    graph.on("collapse-back:click", (e) => {
      handleCollapse(e);
    });

    // 监听画布缩放，缩小到一定程度，节点显示缩略样式
    let currentLevel = 1;
    const briefZoomThreshold = Math.max(graph.getZoom(), 0.5);
    graph.on("viewportchange", (e) => {
      if (e.action !== "zoom") return;
      const currentZoom = graph.getZoom();
      let toLevel = currentLevel;
      if (currentZoom < briefZoomThreshold) {
        toLevel = 0;
      } else {
        toLevel = 1;
      }
      if (toLevel !== currentLevel) {
        currentLevel = toLevel;
        graph.getNodes().forEach((node) => {
          graph.updateItem(node, {
            level: toLevel,
          });
        });
      }
    });
    setSGraph(graph)
    // const width = container.scrollWidth;
    // const height = container.scrollHeight || 500;
    //   const graph = new G6.Graph({
    //     container: container,
    //     width,
    //     height,
    //     layout: {
    //       type: 'force',
    //     },
    //     defaultNode: {
    //       size: 15,
    //     },
    //   });    
    //   fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json')
    // .then((res) => res.json())
    // .then((data) => {
    //   graph.data({
    //     nodes: data.nodes,
    //     edges: data.edges.map(function (edge:any, i:any) {
    //       edge.id = 'edge' + i;
    //       return Object.assign({}, edge);
    //     }),
    //   });
    //   graph.render();

    //   graph.on('node:dragstart', function (e) {
    //     graph.layout();
    //     refreshDragedNodePosition(e);
    //   });
    //   graph.on('node:drag', function (e) {
    //     const forceLayout = graph.get('layoutController').layoutMethods[0];
    //     forceLayout.execute();
    //     refreshDragedNodePosition(e);
    //   });
    //   graph.on('node:dragend', function (e) {
    //     if(e){
    //       e!.item!.get('model').fx = null;
    //       e!.item!.get('model').fy = null;
    //     }

    //   });

    //   if (typeof window !== 'undefined')
    //     window.onresize = () => {
    //       if (!graph || graph.get('destroyed')) return;
    //       if (!container || !container.scrollWidth || !container.scrollHeight) return;
    //       graph.changeSize(container.scrollWidth, container.scrollHeight);
    //     };
    // });
  }, []);

  useEffect(() => {
    // console.log('data change ', data, sgraph);

    if (sgraph != null) {

      sgraph!.changeData(data);
      sgraph.translate(110, 60);
      // sgraph.render();
      sgraph!.refresh();

    }
  }, [data])

  // function refreshDragedNodePosition(e) {
  //   const model = e.item.get('model');
  //   model.fx = e.x;
  //   model.fy = e.y;
  // }
  // console.log('Plugin props', props);
  // const clickApply = () => {
  //   console.log('-----------------', onChange);
  //   var selectedValues = { "equip_id": [3] };
  //   onChange(selectedValues, true)
  // }

  return (
    <Styles
      ref={rootElem}
      height={height}
      width={width}
    >
    </Styles>
  )
  // return (
  //   <div>
  //     <a
  //       href='javascript:void(0)'
  //       onClick={clickApply}
  //     >
  //       Apply
  //     </a>
  //     <Styles
  //       ref={rootElem}
  //       height={height - 20}
  //       width={width}
  //     >
  //       {/* <h3>{props.headerText}</h3>
  //     <pre>${JSON.stringify(data, null, 2)}</pre> */}
  //     </Styles>

  //     <br />
  //     <br />
  //     <br />
  //     <br />
  //     <br />
  //   </div>
  // );
}
