import * as React from "react";
import * as ReactDOM from "react-dom";


import EasyChart from "./EasyChart";
import DonutChart from "./DonutChart";
import DualChart from"./DualChart";
import ComparisonChart from "./ComparisonChart";

import Retention from "./Retention";
import Funnel from "./Funnel";
import RetentionColumn from "./RetentionColumn";
import RetentionLongTime from "./RetentionLongTime";
import ChangeOverTime from "./ChangeOverTime";

ReactDOM.render(
  <ComparisonChart />,
  document.getElementById("example")
);
