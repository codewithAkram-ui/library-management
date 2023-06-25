import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../cart/cartSlice";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import { toast } from "react-toastify";
import { collection, query, where } from "firebase/firestore";
function BookModal(props, args) {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.value);
  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button className="button" onClick={toggle}>
        Show more
      </Button>
      <Modal isOpen={modal} toggle={toggle} {...args} size="lg">
        <ModalHeader className="screen" toggle={toggle}>
          Book Details
        </ModalHeader>
        <ModalBody className="screen">
          <Row xs="2">
            <div>
              <h2>{props.book.bookName}</h2>
              <h4>{props.book.authorName}</h4>
              <br></br>

              <h6>{props.book.description}</h6>
            </div>
            <div>
              <img height={450} alt="Sample" src={props.book.imgUrl} />
            </div>
          </Row>
        </ModalBody>
        <ModalFooter className="screen">
          <div id="add-to-cart">
            <Button
              className="button"
              disabled={props.book.stock === 0}
              onClick={async () => {
                if (cart.includes(props.book)) {
                  toast.error(props.book.bookName + " is already in cart!");
                  toggle();
                } else {
                  dispatch(addToCart(props.book));
                  toast.success(props.book.bookName + " Added To Cart!");
                  toggle();
                }
              }}
            >
              Add To Cart
            </Button>
          </div>
          {props.book.stock === 0 && (
            <UncontrolledTooltip placement="top" target="add-to-cart">
              This book is out of stock
            </UncontrolledTooltip>
          )}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default BookModal;
