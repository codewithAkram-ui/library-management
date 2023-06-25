import React, { useState, useEffect } from "react";
import {
  InputGroup,
  Input,
  Button,
  Spinner,
  Label,
  FormGroup,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BookCard from "../components/book_card.js";
import Dropdown from "../components/dropdown.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";
const Search = () => {
  const [sortBy, setSortBy] = useState("bookName");
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [checkedAuthors, setCheckedAuthors] = useState(new Set());
  const [genres, setGenres] = useState([]);
  const [checkedGenres, setCheckedGenres] = useState(new Set());
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropDownHandler = (dropdownValue) => {
    setSortBy(dropdownValue);
  };
  const authorCheckHandler = (checkedName) => {
    let authorSet = new Set(checkedAuthors);
    if (authorSet.has(checkedName)) {
      authorSet.delete(checkedName);
    } else {
      authorSet.add(checkedName);
    }
    setCheckedAuthors(authorSet);
  };
  const genreCheckHandler = (checkedGenre) => {
    let genreSet = new Set(checkedGenres);
    if (genreSet.has(checkedGenre)) {
      genreSet.delete(checkedGenre);
    } else {
      genreSet.add(checkedGenre);
    }
    setCheckedGenres(genreSet);
  };

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "Books"), orderBy("bookName"));
    getDocs(q)
      .then((snapshot) => {
        let data = [];
        let authorData = [];
        let genreData = [];
        snapshot.forEach((doc) => {
          if (!authorData.includes(doc.data().authorName))
            authorData.push(doc.data().authorName);
          doc.data().genre.forEach((g) => {
            if (!genreData.includes(g)) genreData.push(g);
          });
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
        setGenres(genreData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "Books"), orderBy(sortBy));
    getDocs(q)
      .then((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sortBy]);

  useEffect(() => {
    if (checkedAuthors.size == 0 && checkedGenres.size == 0) {
      setResult(books);
    } else {
      let filteredData = books.filter((item) => {
        if (checkedAuthors.has(item.authorName) && checkedGenres.size == 0)
          return true;

        if (checkedAuthors.size == 0 || checkedAuthors.has(item.authorName)) {
          for (var i = 0; i < item.genreList.length; i++) {
            if (checkedGenres.has(item.genreList[i])) return true;
          }
        }
        return false;
      });
      setResult(filteredData);
    }
  }, [books, checkedAuthors, checkedGenres]);

  useEffect(() => {
    let res = [];
    result.forEach((book) => {
      if (book.bookName.toLowerCase().startsWith(input.toLowerCase()))
        res.push(book);
    });
    setSearchResult(res);
  }, [input, result]);

  return (
    <div style={{ backgroundColor: "#181a1c", display: "flex" }}>
      <div className="filter-pane">
        <h3 className="red-text">Filters</h3>
        <div className="divider"></div>
        <div className="filter-sub-pane">
          <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
            AUTHOR NAME
          </p>
          <div
            className="scrollhost"
            style={{ height: "18rem", overflowY: "scroll" }}
          >
            {loading && (
              <center style={{ margin: "auto", padding: "5%" }}>
                <Spinner />
              </center>
            )}
            {authors.map((author) => (
              <FormGroup check>
                <Input
                  type="checkbox"
                  color="danger"
                  checked={checkedAuthors.has(author)}
                  onChange={() => authorCheckHandler(author)}
                />
                <Label check>{author}</Label>
              </FormGroup>
            ))}
          </div>
        </div>
        <div className="filter-sub-pane">
          <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>GENRE</p>
          <div
            className="scrollhost"
            style={{ height: "18rem", overflowY: "scroll" }}
          >
            {loading && (
              <center style={{ margin: "auto", padding: "5%" }}>
                <Spinner />
              </center>
            )}
            {genres.map((genre) => (
              <FormGroup check>
                <Input
                  type="checkbox"
                  checked={checkedGenres.has(genre)}
                  onChange={() => genreCheckHandler(genre)}
                />
                <Label check>{genre}</Label>
              </FormGroup>
            ))}
          </div>
        </div>
      </div>
      <div className="search-main">
        <div className="search-input">
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <InputGroup>
              <Input
                placeholder={"Enter Book Name"}
                onChange={(e) => setInput(e.target.value)}
                value={input}
                style={{
                  maxHeight: "3rem",
                  alignItems: "center",
                }}
              />
              <Button className="button">Search</Button>
            </InputGroup>
            <Dropdown handler={dropDownHandler} />
          </div>
        </div>
        {loading && (
          <center style={{ margin: "auto", padding: "5%" }}>
            <Spinner />
          </center>
        )}

        <div className="search-results">
          {!loading && searchResult.map((item) => <BookCard book={item} />)}
        </div>
      </div>

      <ToastContainer theme="dark" autoClose={2000} />
    </div>
  );
};
export default Search;
