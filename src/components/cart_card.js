import React from "react";
import {
  Card,
  Button,
  CardBody,
  CardSubtitle,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { ImBin } from "react-icons/im";
import { removeItemFromCart } from "../cart/cartSlice";
export const CartCard = (props) => {
  const dispatch = useDispatch();
  return (
    <Card
      style={{
        width: "18rem",
        backgroundColor: "#353744",
        padding: "10px",
        marginLeft: "10px",
        marginBottom: "10px",
      }}
    >
      <CardBody>
        <Row xs="2">
          <Col>
            <CardTitle tag="h6">{props.item.bookName}</CardTitle>
            <CardSubtitle
              style={{ marginTop: "10px", color: "#E2DDBF" }}
              className="mb-2 text"
              tag="h6"
            >
              {props.item.authorName}
            </CardSubtitle>
            <br></br>

            <Button
              color="danger"
              onClick={() => {
                dispatch(removeItemFromCart(props.item));
              }}
            >
              <ImBin />
            </Button>
          </Col>

          <img
            style={{ maxHeight: "170px" }}
            alt="Sample"
            src={props.item.imgUrl}
          />
        </Row>
      </CardBody>
    </Card>
  );
};
