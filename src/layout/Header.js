import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { doc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
const Header = ({ logoutHandler }) => {
  const [isOpen, setIsOpen] = useState(false);

  const addItem = async () => {
    const collectionRef = collection(db, "Books");
    await addDoc(collectionRef, {
      bookName: "The Hobbit",
      authorName: "J.R.R. Tolkien",
      genre: ["Fiction", "Fantasy"],
      yearOfPublishing: 1937,
      stock: 12,
      imgUrl: "https://cdn2.penguin.com.au/covers/original/9780141949055.jpg",
    });
  };
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar expand="md" color="primary">
        <NavbarBrand href="/">Library Management</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink to="/cart">Cart</NavLink>
            </NavItem>
          </Nav>

          <Button onClick={logoutHandler}>Logout</Button>
          <Button onClick={addItem}>Add Book </Button>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
