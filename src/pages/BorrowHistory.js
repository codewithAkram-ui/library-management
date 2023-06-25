import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { Card, Row, Spinner } from "reactstrap";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { BorrowedBookCard } from "../components/BorrowedBookCard";

export const BorrowHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "Orders"),
      where("user", "==", window.sessionStorage.getItem("email")),
      orderBy("createdAt", "desc")
    );
    getDocs(q)
      .then((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({
            books: doc.data().books,
            createdAt: new Date(doc.data().createdAt),
          });
        });
        console.log(auth.currentUser.email);
        console.log(data);
        setOrders(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  console.log(orders);
  return (
    <div>
      <h2 style={{ padding: "20px" }}>Borrowed Books</h2>
      <div>
        {loading ? (
          <center style={{ margin: "auto", padding: "5%" }}>
            <Spinner />
          </center>
        ) : (
          orders && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "2%",
              }}
            >
              {orders.map((order) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",

                    padding: "0.5rem",
                  }}
                >
                  <h3 style={{ width: "15rem", margin: "16px 10px" }}>
                    {order.createdAt.toDateString()}
                  </h3>
                  <div style={{ flex: 1, display: "flex", flexWrap: "wrap" }}>
                    {order.books.map((book) => (
                      <BorrowedBookCard item={book}></BorrowedBookCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
