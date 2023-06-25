import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartCard } from "../components/cart_card";
import {
  Button,
  Spinner,
  OffcanvasBody,
  Offcanvas,
  OffcanvasHeader,
} from "reactstrap";

import { emptyCart } from "../cart/cartSlice";
import { auth, db } from "../firebase/firebase";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";
const Cart = (props) => {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const buttonHandler = async () => {
    setLoading(true);
    try {
      let latestDocs = [];
      for (var i = 0; i < cart.length; i++) {
        var snapshot = await getDoc(doc(db, "Books", cart[i].id));
        latestDocs.push(snapshot);
        if (snapshot.data().stock == 0) {
          toast.error(
            "Sorry, " + snapshot.data().bookName + " is out of stock!"
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
        user: auth.currentUser.email,
        books: borrowedBooks,
      });
      await batch.commit();
      //  addDoc(collectionRef, {
      //   bookName: "The Hobbit",
      //   authorName: "J.R.R. Tolkien",
      //   genre: ["Fiction", "Fantasy"],
      //   yearOfPublishing: 1937,
      //   stock: 12,
      //   imgUrl: "https://cdn2.penguin.com.au/covers/original/9780141949055.jpg",
      // });
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
