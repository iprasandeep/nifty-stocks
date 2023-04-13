import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { symbols } from "../../stockSymbols";
import "./stockslist.css";


const API_URL = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/symbols=${symbols.join(",")}`;

 const API_KEY = "20e52ad19dmsh5b10113626a9a33p1d5c42jsn8bd4d6620482";

const StocksList = React.memo(() => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState("");

  const fetchData = useCallback(() => {
    axios({
      method: "GET",
      url: API_URL,
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host":  'yahoo-finance15.p.rapidapi.com',
      },
      qs: {
        symbols: symbols.join(","),
      },
    })
      .then((response) => {
        const newStocks = response.data.map((stock) => ({
          name: stock.shortName,
          price: stock.regularMarketPrice.toFixed(2),
          openPrice: stock.regularMarketOpen.toFixed(2),
          previousClosePrice: stock.regularMarketPreviousClose.toFixed(2),
        }));
        setStocks(newStocks);
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to fetch data");
      });
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchData();
    }, 10000);

    return () => {
      clearTimeout(debounce);
    };
  }, [fetchData]);

  return (
    <div className="main">
      <div className="title">
        <h3 className="heading">NIFTY50 STOCK LIST</h3>
      </div>
      <div className="body">
        {error ? (
          <p className="error">{error}<span> &#129488;</span></p>
        ) : (
          <ul>
            {stocks.map((stock, index) => (
              <ul key={index}>
                <li>
                {/*<p className="">{index+1}</p>*/}
                  <div className="name">{stock.name}</div>
                  <div className="price">Price: ₹ {stock.price}</div>
                  <div className="open-price">
                    <span>Opening:</span> ₹ {stock.openPrice}
                  </div>
                  <div className="close-price">
                    <span>Closing:</span> ₹ {stock.previousClosePrice}
                  </div>
                  <div
                    className={
                      stock.price - stock.previousClosePrice >= 0
                        ? "price-increase"
                        : "price-decrease"
                    }
                  >
                    <span className="change">Change:</span>{" "}
                    {(
                      ((stock.price - stock.previousClosePrice) *
                        100 /
                        stock.previousClosePrice
                      ).toFixed(2) + "%"
                    ) +
                      (stock.price - stock.previousClosePrice >= 0
                        ? " ↑"
                        : " ↓")}
                  </div>
                </li>
              </ul>
            ))}
          </ul>
          )}
        </div>
        </div>
      );
    }
)
export default StocksList;




