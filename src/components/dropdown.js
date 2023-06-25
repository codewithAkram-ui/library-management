import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import PropTypes from "prop-types";
import "./custom.css";

function SearchByDropdown(props, { direction, ...args }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setValue] = useState("Book Name");
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const changeValue = (value) => {
    props.handler(value);
    setValue(value);
  };

  return (
    <div className="d-flex border-right-zero" style={{ padding: "0rem" }}>
      <ButtonDropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        direction={direction}
      >
        <DropdownToggle caret>{dropdownValue}</DropdownToggle>
        <DropdownMenu {...args}>
          <DropdownItem onClick={() => changeValue("Book Name")}>
            Book Name
          </DropdownItem>
          <DropdownItem onClick={() => changeValue("Genre")}>
            Genre
          </DropdownItem>
          <DropdownItem onClick={() => changeValue("Author Name")}>
            Author Name
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
}

SearchByDropdown.propTypes = {
  direction: PropTypes.string,
};

export default SearchByDropdown;
