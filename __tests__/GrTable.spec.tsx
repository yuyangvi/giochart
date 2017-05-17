/* tslint-disable no-undef, no-console */
import * as React from "react";
import { mount, shallow, render } from "enzyme";
import toJson from "enzyme-to-json";
import { DrawParamsProps, Source } from "../src/chartProps";
import GrTable from "../src/GrTable";

describe("<GrTable />", () => {
  const source: Source = [
    { tm: 1482940800000, ogw432: 816, rate: 0.4 },
    { tm: 1483027200000, ogw432: 677, rate: 0.4 },
    { tm: 1483113600000, ogw432: 139, rate: 0.4 },
    { tm: 1483200000000, ogw432: 109, rate: 0.5 },
    { tm: 1483286400000, ogw432: 152, rate: 0.1 },
    { tm: 1483372800000, ogw432: 744, rate: 0.4 },
    { tm: 1483459200000, ogw432: 783, rate: 0.2 }
  ];
  const drawParams: DrawParamsProps = {
    chartType: "table",
    columns: [
      { id: "tm", name: "时间", isDim: true },
      { id: "0gw432", name: "访问用户量", isDim: false },
      { id: "rate", name: "访量", isDim: false }
    ],
    granularities: [{ id: "tm", interval: 86400000 }]
  };
  const createTable = () => (
    <GrTable
      chartParams={drawParams}
      source={source}
    />
  );
  const wrapper = shallow(<GrTable chartParams={drawParams} source={source} />);
  it("时间格式正常", () => {
    expect(wrapper.props().columns[0].render(1483113600000)).toBe("2016-12-31");
  });

  it("数字格式正常", () => {
    expect(wrapper.props().columns[1].render(744).children).toBe("744");
  });

  it("指标的中位数背景", () => {
    expect(wrapper.props().columns[2].render(0.1).props.style.backgroundColor).toBe("rgba(95,182,199, 0.5)");
  });

});
