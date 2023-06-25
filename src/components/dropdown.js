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
  const [dropdownValue, setValue] = useState("Sort by Book Name");
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const changeValue = (value) => {
    switch (value) {
      case "Book Name":
        props.handler("bookName");
        break;
      case "Author Name":
        props.handler("authorName");
        break;
      case "Year of Publishing":
        props.handler("yearOfPublishing");
        break;
      case "Availability":
        props.handler("stock");
        break;
    }
    setValue("Sort by " + value);
  };

  return (
    <ButtonDropdown
      style={{ marginLeft: "10px" }}
      isOpen={dropdownOpen}
      toggle={toggle}
      direction={direction}
    >
      <DropdownToggle caret>{dropdownValue}</DropdownToggle>
      <DropdownMenu {...args}>
        <DropdownItem onClick={() => changeValue("Book Name")}>
          Book Name
        </DropdownItem>
        <DropdownItem onClick={() => changeValue("Author Name")}>
          Author Name
        </DropdownItem>
        <DropdownItem onClick={() => changeValue("Year of Publishing")}>
          Year of Publishing
        </DropdownItem>
        <DropdownItem onClick={() => changeValue("Availability")}>
          Availability
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
}

SearchByDropdown.propTypes = {
  direction: PropTypes.string,
};

export default SearchByDropdown;
