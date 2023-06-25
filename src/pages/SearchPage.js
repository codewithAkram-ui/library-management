import React, { useState, useEffect } from "react";
import {
  InputGroup,
  Input,
  Button,
  Spinner,
  ButtonGroup,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Label,
  FormGroup,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BookCard from "../components/book_card.js";
import Dropdown from "../components/dropdown.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Firestore,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";
import SimpleBar from "simplebar";
const Search = () => {
  const [input, setInput] = useState("");
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [authorCheckedState, setAuthorCheckedState] = useState([]);
  const [genre, setGenres] = useState([]);
  const [genreCheckedState, setGenreCheckedState] = useState([]);
  const [filterBy, setFilter] = useState("Book Name");
  const [result, setResult] = useState([]);
  const [sortBy, setSortBy] = useState("bookName");
  const [loading, setLoading] = useState(false);
  const dropDownHandler = (dropdownValue) => {
    setFilter(dropdownValue);
  };
  const authorCheckHandler = (checkName, position) => {
    let res = [];
    var authorSet = new Set();
    var flag = false;
    const updatedCheckedState = authorCheckedState.map((item, index) => {
      return index === position ? !item : item;
    });
    setAuthorCheckedState(updatedCheckedState);

    for (var i = 0; i < updatedCheckedState.length; i++) {
      if (updatedCheckedState[i]) {
        flag = true;
        authorSet.add(authors[i]);
      }
    }
    if (!flag) {
      setResult(books);
      return;
    }

    books.forEach((book) => {
      if (authorSet.has(book.authorName)) {
        console.log(book.authorName);

        res.push(book);
      }
    });
    setResult(res);
  };

  useEffect(() => {
    setLoading(true);

    const q = query(collection(db, "Books"), orderBy(sortBy));
    getDocs(q)
      .then((snapshot) => {
        let data = [];
        let authorData = [];
        snapshot.forEach((doc) => {
          if (!authorData.includes(doc.data().authorName))
            authorData.push(doc.data().authorName);
          data.push({
            id: doc.id,
            bookName: doc.data().bookName,
            genreList: doc.data().genre,
            authorName: doc.data().authorName,
            imgUrl: doc.data().imgUrl,
            description: doc.data().description,
            stock: doc.data().stock,
          });
        });
        setBooks(data);
        setAuthors(authorData);
        setAuthorCheckedState(Array(authorData.length).fill(false));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sortBy]);

  useEffect(() => {
    let res = [];
    books.forEach((book) => {
      let searchBy;
      switch (filterBy) {
        case "Book Name":
          searchBy = [book.bookName];
          break;
        case "Genre":
          searchBy = book.genreList;
          break;
        case "Author Name":
          searchBy = [book.authorName];
          break;
      }

      searchBy.forEach((x) => {
        if (x.toLowerCase().startsWith(input.toLowerCase()) === true) {
          if (!res.includes(book)) res.push(book);
        }
      });
    });
    setResult(res);
  }, [input, books, filterBy]);

  return (
    <div style={{ backgroundColor: "#24292F", display: "flex" }}>
      <div style={{ width: "20rem" }}>
        Filters
        <br></br>
        Author Name
        <br></br>
        <div
          className="scrollhost"
          style={{ height: "20rem", overflowY: "scroll" }}
        >
          {authors.map((author, index) => (
            <FormGroup check>
              <Input
                type="checkbox"
                checked={authorCheckedState[index]}
                onChange={() => authorCheckHandler(author, index)}
              />
              <Label check>{author}</Label>
            </FormGroup>
          ))}
        </div>
        <br></br>
        Genre
        <br></br>
        <div
          className="scrollhost"
          style={{ height: "20rem", overflowY: "scroll" }}
        >
          {authors.map((author, index) => (
            <FormGroup check>
              <Input
                type="checkbox"
                checked={authorCheckedState[index]}
                onChange={() => authorCheckHandler(author, index)}
              />
              <Label check>{author}</Label>
            </FormGroup>
          ))}
        </div>
      </div>
      <div style={{}}>
        <div
          style={{
            // backgroundColor: "black",
            paddingTop: "10px",
            paddingBottom: "10px",
            width: "50%",
            minWidth: "20rem",
            margin: "auto",
          }}
        >
          <InputGroup>
            <Dropdown handler={dropDownHandler} />
            <Input
              placeholder={"Enter " + filterBy}
              onChange={(e) => setInput(e.target.value)}
              value={input}
              style={{
                maxHeight: "3rem",
                alignItems: "center",
              }}
            />
            <Button className="button">Search</Button>
          </InputGroup>
          <br></br>
          <h6>Sort By:</h6>
          <ButtonGroup>
            <Button
              color="primary"
              outline
              onClick={() => setSortBy("bookName")}
              active={sortBy === "bookName"}
            >
              Book Name
            </Button>
            <Button
              color="primary"
              outline
              onClick={() => setSortBy("authorName")}
              active={sortBy === "authorName"}
            >
              Author Name
            </Button>
            <Button
              color="primary"
              outline
              onClick={() => setSortBy("yearOfPublishing")}
              active={sortBy === "yearOfPublishing"}
            >
              Year of Publishing
            </Button>
            <Button
              color="primary"
              outline
              onClick={() => setSortBy("stock")}
              active={sortBy === "stock"}
            >
              Availability
            </Button>
          </ButtonGroup>
        </div>
        {loading && (
          <center style={{ margin: "auto", padding: "5%" }}>
            <Spinner />
          </center>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            paddingTop: "2%",
          }}
        >
          {!loading && result.map((item) => <BookCard book={item} />)}
        </div>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};
export default Search;
