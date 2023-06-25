import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Badge,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BookModal from "../pages/book_details";
function BookCard(props) {
  return (
    <Card
      style={{
        border: 0,
        backgroundColor: "#353744",
        width: "18rem",
        margin: "1.5rem",
      }}
    >
      <img style={{ height: "25rem" }} alt="Sample" src={props.book.imgUrl} />
      <CardBody>
        <CardTitle className="text-light" tag="h5">
          {props.book.bookName}
        </CardTitle>
        <CardSubtitle className="mb-2" style={{ color: "#E2DDBF" }} tag="h6">
          {props.book.authorName}
        </CardSubtitle>
        <div style={{ display: "flex" }}>
          {props.book.genreList.map((genre) => (
            <Badge style={{ marginRight: "5px" }}>{genre}</Badge>
          ))}
        </div>

        <CardText
          style={{
            marginTop: "5px",

            marginBottom: "7px",
            color: props.book.stock == 0 ? "red" : "lightgreen",
          }}
        >
          {props.book.stock} books left
        </CardText>

        <BookModal book={props.book} />
      </CardBody>
    </Card>
  );
}

export default BookCard;
