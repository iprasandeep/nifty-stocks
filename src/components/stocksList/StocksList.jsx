import React, { useState, useEffect } from "react";
import axios from "axios";
import { symbols } from "../../StockList";
import "./stockslist.css";
// const API_KEY = '854ac9e4ebmsh68f08fe5e18223bp1fc8c5jsn3911ecef60e2'; // replace with your actual key

const API_URL = `https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=IN&symbols=${symbols.join(",")}`;

const API_KEY ='fb7d43fb98msh4a51fafede9df75p196caajsn0833c148279e';

function StocksList() {
    const [stocks, setStocks] = useState([]);
  
    useEffect(() => {
      const interval = setInterval(() => {
        axios({
          method: "GET",
          url: API_URL,
          headers: {
            "X-RapidAPI-Key": API_KEY,
            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
          },
          qs: {
            symbols: symbols.join(","),
          },
        })
          .then((response) => {
            const newStocks = response.data.quoteResponse.result.map((stock) => ({
              // symbol: stock.symbol,
              // logo: stock.img_url,
              name: stock.shortName,
              price: stock.regularMarketPrice.toFixed(2),
              openPrice: stock.regularMarketOpen.toFixed(2),
              previousClosePrice: stock.regularMarketPreviousClose.toFixed(2),
              // marketCap: stock.marketCap,
              // totalQuantity: stock.regularMarketVolume,
            }));
            setStocks(newStocks);
            console.log(response)
           
          })
          .catch((error) => console.log(error));
      }, 1000000); // 10 Sec
  
      return () => clearInterval(interval);
    }, []);

    return (
        <div className="main">
          <div className="title">
            <h3 className="heading">NIFTY50 STOCK LIST</h3>
          </div>
            <div className="body">
            <ul>
              {stocks.map((stock, index) => (
                <ul key={index}>
                  <li>
                  {/*<p>{index+1}</p> */}
                    <div className="name">{stock.name}</div>
                    <div className="price">Price: ₹ {stock.price}</div>
                    <div className="open-price"><span>Opening:</span> ₹ {stock.openPrice}</div>
                    <div className="close-price"><span>Closing:</span> ₹ {stock.previousClosePrice}</div>
                    <div  className={
                      stock.price - stock.previousClosePrice >= 0
                        ? "price-increase"
                        : "price-decrease"
                    }><span className="change">Change:</span> {((stock.price - stock.previousClosePrice) * 100 / stock.previousClosePrice).toFixed(2)}%
                    {(stock.price - stock.previousClosePrice)* 100 / stock.previousClosePrice >= 0 ? " ↑" : " ↓"}
                    </div>
                  </li>
                </ul>
              ))}
              </ul>
              </div>
        </div>
      );
  }
  

export default StocksList;
