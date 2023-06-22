import React, { useState, useEffect } from "react";
import {
  InputGroup,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../axios.js";
import BookCard from "../components/book_card.js";
import Dropdown from "../components/dropdown.js";
import {
  collection,
   getDocs,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
const Home = () => {
  const [input, changeInput] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilter] = useState("Book Name");

  const dropDownHandler = (dropdownValue) => {
    setFilter(dropdownValue);
  };

  const submitHandler = async (data) => {
    // const q = query(collection(db, "Books"), where("name", "<=", data + "z"));
    const querySnapshot = await getDocs(
      collection(db, "Books"),
      orderBy("bookName"),
      startAt([data]),
      endAt([data + "\uf8ff"])
    );
    let res = [];

    querySnapshot.forEach((doc) => {
      let searchBy;
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      switch (filterBy) {
        case "Book Name":
          searchBy = [doc.data().bookName];
          break;
        case "Genre":
          searchBy = doc.data().genre;
          break;
        case "Author Name":
          searchBy = [doc.data().authorName];
          break;
      }
      searchBy.map((x) => {
        if (x.toLowerCase().startsWith(data.toLowerCase()) === true)
          res.push({
            id: doc.id,
            name: doc.data().bookName,
            genre: doc.data().genre,
            author: doc.data().authorName,
            imgUrl: doc.data().imgUrl,
          });
      });
    });
    console.log(res);
    setResult(res);
  };
  // setResult(querySnapshot);

   useEffect(() => {
    let timer;
    if (input.length == 0){
      setLoading(false);
    }
    else
     {
      setLoading(true);
      timer = setTimeout(async () => {
        await submitHandler(input);
      setLoading(false)
       }, 500);
    }
    return () => clearTimeout(timer);
  }, [input]);
  return (
    <div>
      <div
        style={{
          paddingTop: "2rem",
          width: "50%",
          minWidth: "20rem",
          margin: "auto",
        }}
      >
        <InputGroup>
          <Dropdown handler={dropDownHandler} />

          <Input
            placeholder={"Enter " + filterBy}
            onChange={(e) => changeInput(e.target.value)}
            value={input}
            style={{
              maxHeight: "3rem",
              alignItems: "center",
            }}
          />
          <Button
            color="primary"
            onClick={() => submitHandler(input)}
            style={{ maxHeight: "3rem" }}
          >
            Search
          </Button>
        </InputGroup>
      </div>
      {loading && (
        <center style={{ margin: "auto" , padding: "5%"}}>
          <Spinner color="primary" />
        </center>
      )}
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" , paddingTop: "2%"}}
      >
        {!loading &&
          result &&
          result.map((book) => (
            <BookCard
              title={book.name}
              author={book.author}
              imgUrl={book.imgUrl}
              genreList={book.genre}
            />
          ))}
      </div>
    </div>
  );
};
export const app = "lklk";
export default Home;
