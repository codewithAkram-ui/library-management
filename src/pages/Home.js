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
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BookCard from "../components/book_card.js";
import InfiniteScroll from "react-infinite-scroll-component";
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
import { db } from "../firebase/firebase.js";
const Home = () => {
  const [books, setBooks] = useState([]);
  const [lastItemOfPage, setLastItem] = useState("");
  const [hasMoreBool, setHasMore] = useState(true);
  const pageLimit = 4;
  const paginatedFetch = async () => {
    const q = query(
      collection(db, "Books"),
      orderBy("bookName"),
      startAfter(lastItemOfPage),
      limit(pageLimit)
    );
    const querySnapshot = await getDocs(q);
    console.log("fetched " + lastItemOfPage);
    let data = [];
    querySnapshot.forEach((doc) => {
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
    if (data.length === 0 || data.length < pageLimit) {
      setHasMore(false);
    } else {
      setLastItem(data[data.length - 1].bookName);
      setBooks([...books, ...data]);
      console.log(books);
    }
  };
  useEffect(() => {
    paginatedFetch();
  }, []);
  return (
    <div>
      <InfiniteScroll
        dataLength={books.length}
        next={paginatedFetch}
        hasMore={hasMoreBool} // Replace with a condition based on your data source
        loader={
          <center style={{ margin: "auto", padding: "5%" }}>
            <Spinner />
          </center>
        }
        endMessage={
          books.length && (
            <center style={{ margin: "10px" }}>
              You have reached the end of our collection!!.
            </center>
          )
        }
        // refreshFunction={refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        // }
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            paddingTop: "2%",
          }}
        >
          {books.map((item) => (
            <BookCard book={item} />
          ))}
        </div>
      </InfiniteScroll>
      <div>
        <ToastContainer theme="dark" />
      </div>
    </div>
  );
};

export default Home;
