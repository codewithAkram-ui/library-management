import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartCard } from "../components/CartCard";
import {
  Button,
  Spinner,
  OffcanvasBody,
  Offcanvas,
  OffcanvasHeader,
} from "reactstrap";

import { emptyCart } from "../cart/cartSlice";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-toastify";
const Cart = (props) => {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const buttonHandler = async () => {
    setLoading(true);
    try {
      let latestDocs = [];
      let previouslyBorrowed = [];
      const orderQuery = query(
        collection(db, "Orders"),
        where("user", "==", window.sessionStorage.getItem("email")),
        orderBy("createdAt", "desc")
      );
      await getDocs(orderQuery).then((snapshot) => {
        snapshot.forEach((doc) => {
          previouslyBorrowed = [
            ...previouslyBorrowed,
            ...[...doc.data().books.map((book) => book.bookName)],
          ];
        });
      });
      console.log(previouslyBorrowed);

      for (var i = 0; i < cart.length; i++) {
        var snapshot = await getDoc(doc(db, "Books", cart[i].id));
        latestDocs.push(snapshot);
        if (snapshot.data().stock == 0) {
          toast.error(
            "Sorry, " + snapshot.data().bookName + " is out of stock!"
          );
          return;
        }
        if (previouslyBorrowed.includes(cart[i].bookName)) {
          toast.error(
            "You have already borrowed a copy of " + snapshot.data().bookName
          );
          return;
        }
      }

      const batch = writeBatch(db);
      latestDocs.forEach(async (book) => {
        var docRef = doc(db, "Books", book.id);
        batch.update(docRef, { stock: book.data().stock - 1 });
      });

      let borrowedBooks = [];
      cart.forEach((item) => {
        borrowedBooks.push({
          bookName: item.bookName,
          authorName: item.authorName,
          imgUrl: item.imgUrl,
        });
      });

      batch.set(doc(collection(db, "Orders")), {
        createdAt: Date.now(),
        user: window.sessionStorage.getItem("email"),
        books: borrowedBooks,
      });
      await batch.commit();

      toast.success("Enjoy your books!");
      dispatch(emptyCart());
      props.toggle();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Offcanvas
      className="screen"
      isOpen={props.isOpen}
      scrollable={true}
      toggle={props.toggle}
    >
      <OffcanvasHeader toggle={props.toggle}>Cart</OffcanvasHeader>

      <OffcanvasBody>
        {cart.length > 0 ? (
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {cart.map((book) => (
                <CartCard item={book} />
              ))}
            </div>
            <br></br>
            {isLoading ? (
              <Spinner style={{ margin: "1px" }} />
            ) : (
              <Button onClick={buttonHandler} className="button">
                Checkout
              </Button>
            )}
          </div>
        ) : (
          <p>Cart is empty {":("}</p>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default Cart;
