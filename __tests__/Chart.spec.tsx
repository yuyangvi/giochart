/* tslint-disable no-undef, no-console */
import * as React from "react";
import { mount } from "enzyme";
import * as sinon from "sinon";

import Chart from "../src/Chart";
import { DrawParamsProps, Source } from "../src/chartProps";

describe("<Chart />", () => {
  const source: Source = [
    { tm: 1482940800000, ogw432: 816 },
    { tm: 1483027200000, ogw432: 677 },
    { tm: 1483113600000, ogw432: 139 },
    { tm: 1483200000000, ogw432: 109 },
    { tm: 1483286400000, ogw432: 152 },
    { tm: 1483372800000, ogw432: 744 },
    { tm: 1483459200000, ogw432: 783 }
  ];
  const drawParams: DrawParamsProps = {
    chartType: "line",
    columns: [
      { id: "tm", name: "时间", isDim: true },
      { id: "0gw432", name: "访问用户量", isDim: false }
    ],
    granularities: [{ id: "tm", interval: 86400000 }]
  };
  const chart = <Chart source={source} chartParams={drawParams} />;
  it("初始化正常", () => {
    sinon.spy(Chart.prototype, "componentDidMount");
    const wrapper = mount(chart);
    expect(Chart.prototype.componentDidMount.calledOnce).toEqual(true);
  });

});
