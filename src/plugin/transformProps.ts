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
import {
  ChartProps,
  DataRecordValue,
  getMetricLabel,
  TimeseriesDataRecord,
} from "@superset-ui/core";

export default function transformProps(chartProps: ChartProps) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your SupersetPluginChartHelloWorld.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queriesData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queriesData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const { width, height, formData, queriesData } = chartProps;
  const data = queriesData[0].data || [];
  const { id, parent, name, metric = "", rootNodeId } = formData;

  const metricLabel = getMetricLabel(metric);
  const nameColumn = name || id;

  function findNodeName(rootNodeId: DataRecordValue) {
    let nodeName: DataRecordValue = "";
    data.some((node) => {
      if (node[id]!.toString() === rootNodeId) {
        nodeName = node[nameColumn];
        return true;
      }
      return false;
    });
    return nodeName;
  }

  function findNodValue(rootNodeId: DataRecordValue) {
    let nodeValue: DataRecordValue = 0;
    data.some((node) => {
      if (node[id]!.toString() === rootNodeId) {
        nodeValue = node[metricLabel];
        return true;
      }
      return false;
    });
    return nodeValue;
  }

  function getTotalChildren(tree) {
    let totalChildren = 0;

    function traverse(tree) {
      tree.children!.forEach((node) => {
        traverse(node);
      });
      totalChildren += 1;
    }
    traverse(tree);
    return totalChildren;
  }

  function createTree(rootNodeId: DataRecordValue) {
    const rootNodeName = findNodeName(rootNodeId);
    const rootNodeValue = findNodValue(rootNodeId);

    const tree = {
      name: rootNodeName,
      children: [] as Array<any>,
      value: rootNodeValue,
    };
    const children = [] as Array<any>;
    const indexMap: { [name: string]: number } = {};

    if (!rootNodeName) {
      return tree;
    }

    // index indexMap with node ids
    for (let i = 0; i < data.length; i += 1) {
      const nodeId = data[i][id] as number;
      indexMap[nodeId] = i;
      children[i] = [];
    }

    // generate tree
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      if (node[parent]?.toString() === rootNodeId) {
        tree.children?.push({
          name: node[nameColumn],
          children: children[i],
          value: node[metricLabel],
        });
      } else {
        const parentId = node[parent];
        if (data[indexMap[parentId]]) {
          const parentIndex = indexMap[parentId];
          children[parentIndex].push({
            name: node[nameColumn],
            children: children[i],
            value: node[metricLabel],
          });
        }
      }
    }

    return tree;
  }

  let finalTree = {};

  if (rootNodeId) {
    finalTree = createTree(rootNodeId);
  } else {
    let _rootNodeId = '';
    data.forEach((node) => {
      if (node[parent] == null) {
        _rootNodeId = `${node[id]}`;
        return;
      }
    });
console.log('_rootNodeId',_rootNodeId);

    finalTree = createTree(_rootNodeId);

    /*
      to select root node,
      1.find parent nodes with only 1 child.
      2.build tree for each such child nodes as root
      3.select tree with most children
    */
    // create map of parent:children
    // const parentChildMap: { [name: string]: { [name: string]: any } } = {};
    // data.forEach((node) => {
    //   const parentId = node[parent] as string;
    //   if (parentId in parentChildMap) {
    //     parentChildMap[parentId].push({ id: node[id] });
    //   } else {
    //     parentChildMap[parentId] = [{ id: node[id] }];
    //   }
    // });

    // // for each parent node which has only 1 child,find tree and select node with max number of children.
    // let maxChildren = 0;
    // Object.keys(parentChildMap).forEach((key) => {
    //   if (parentChildMap[key].length === 1) {
    //     const tree = createTree(parentChildMap[key][0].id);
    //     const totalChildren = getTotalChildren(tree);
    //     if (totalChildren > maxChildren) {
    //       maxChildren = totalChildren;
    //       finalTree = tree;
    //     }
    //   }
    // });
  }

  return {
    width,
    height,
    data: finalTree,
    // and now your control data, manipulated as needed, and passed through as props!
    // boldText,
    // headerFontSize,
    // headerText,
  };
}
