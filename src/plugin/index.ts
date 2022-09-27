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
import { t, ChartMetadata, ChartPlugin } from '@superset-ui/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from '../images/thumbnail.png';

export default class SupersetPluginChartHelloWorld extends ChartPlugin {
  /**
   * The constructor is used to pass relevant metadata and callbacks that get
   * registered in respective registries that are used throughout the library
   * and application. A more thorough description of each property is given in
   * the respective imported file.
   *
   * It is worth noting that `buildQuery` and is optional, and only needed for advanced visualizations that require either post processing operations (pivoting, rolling aggregations, sorting etc) or submitting multiple queries.
   */
  constructor() {
    const metadata = new ChartMetadata({
      description: '决策树是在已知各种情况的基础上，通过事项构建树状图，根据自己的上下级进行关联，挂接到对应的分支，常用于项目风险评估，可行性的决策分析等场景，是直观运用概率分析的一种图解法。支持展开、收起、悬停、点击等交互。支持根据当前缩放等级，节点切换详情模式与缩略模式。',
      name: t('决策树'),
      thumbnail,
      // useLegacyApi: true,
    });

    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('../SupersetPluginChartHelloWorld'),
      metadata,
      transformProps,
    });
  }
}
