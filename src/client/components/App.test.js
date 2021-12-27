/* global describe,it,expect */

import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("<App>", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.children.length).toBeGreaterThan(0);
  });
});
