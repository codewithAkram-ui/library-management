import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
} from "reactstrap";
function BookCard(props) {
  return (
    <Card
      style={{
        width: "18rem",
        margin: "0.5rem",
      }}
    >
      <img alt="Sample" src={props.imgUrl} />
      <CardBody>
        <CardTitle tag="h5">{props.title}</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          {props.author}
        </CardSubtitle>

        {props.genreList.map((genre) => (
          <CardText>{genre}</CardText>
        ))}
        <Button>Button</Button>
      </CardBody>
    </Card>
  );
}

export default BookCard;
