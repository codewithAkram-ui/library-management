import React from "react";
import { FormGroup, Input, Label, Spinner } from "reactstrap";

export const FilterCategory = (props) => {
  return (
    <div className="filter-sub-pane">
      <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
        {props.title}
      </p>
      <div
        className="scrollhost"
        style={{ height: "18rem", overflowY: "scroll" }}
      >
        {props.initialLoading ? (
          <center style={{ margin: "auto", padding: "5%" }}>
            <Spinner />
          </center>
        ) : (
          props.list.map((item) => (
            <FormGroup check>
              <Input
                type="checkbox"
                checked={props.isCheckedSet.has(item)}
                onChange={() => props.onChangeHandler(item)}
              />
              <Label check>{item}</Label>
            </FormGroup>
          ))
        )}
      </div>
    </div>
  );
};
