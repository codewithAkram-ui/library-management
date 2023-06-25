import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Badge,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
} from "reactstrap";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../assets/logo.png";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Cart from "../pages/Cart";
const Header = ({ logoutHandler }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart.value.length);
  const [modal, setModal] = useState(false);

  const cartToggle = () => setModal(!modal);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar
        expand="md"
        dark={true}
        style={{ height: "75px", backgroundColor: "#0D1117" }}
      >
        <NavbarBrand>
          <NavLink to="/">
            <img height={75} alt="BookShelf" src={logo} />
          </NavLink>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" fill navbar>
            <NavItem style={{ marginTop: "4px", marginRight: "50px" }}>
              <NavLink
                to="/search"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "20px",
                }}
              >
                Search
              </NavLink>
            </NavItem>
            <NavItem style={{ marginRight: "50px" }}>
              <Button className="button" onClick={cartToggle}>
                <FaShoppingCart color="black" />
                {<Badge style={{ marginLeft: "10px" }}>{cartCount}</Badge>}
              </Button>
            </NavItem>
          </Nav>

          <Cart toggle={cartToggle} isOpen={modal} />

          <Button
            color="black"
            style={{ backgroundColor: "white" }}
            onClick={logoutHandler}
          >
            Logout
          </Button>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
