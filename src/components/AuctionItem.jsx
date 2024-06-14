import React, { useState, useEffect } from "react";
import Photos from "./Photos";
import BidCount from "./BidCount";
import CurrentBid from "./CurrentBid";
import TimeLeft from "./TimeLeft";
import Button from "./Button";
import HighBidder from "./HighBidder";
import Seller from "./Seller";
import Title from "./Title";
import EditButton from "./EditButton";

const Item = (props) => {
  const calculateTimeLeft = () => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const now = new Date().getTime();
    const then = new Date(props.closeDate).getTime();
    const difference = then - now;

    const daysLeft = Math.floor(difference / day);
    const hoursLeft = Math.floor((difference % day) / hour);
    const minutesLeft = Math.floor((difference % hour) / minute);
    const secondsLeft = Math.floor((difference % minute) / 1000);

    if (difference <= 0) {
      return "Bidding Closed";
    }

    if (daysLeft > 0) {
      return `${daysLeft}D ${hoursLeft}H ${minutesLeft}M ${secondsLeft}S left`;
    }
    if (hoursLeft > 0) {
      return `${hoursLeft}H ${minutesLeft}M ${secondsLeft}S left`;
    }
    if (minutesLeft > 0) {
      return `${minutesLeft}M ${secondsLeft}S left`;
    }
    return `${secondsLeft}S left`;
  };

  const [left, setLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timerId = setInterval(() => {
      setLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timerId);
  }, [props.closeDate]);

  const sendBid = () => {
    props.sendBid(props.id);
  };

  const deleteItem = () => {
    props.deleteItem(props.id);
  };

  const newBid = () => {
    const price = props.price;
    let increase = 0;

    if (price < 10) increase = 1;
    else if (price < 50) increase = 2;
    else if (price < 100) increase = 5;
    else if (price < 500) increase = 10;
    else if (price < 1000) increase = 25;
    else if (price < 10000) increase = 100;
    else increase = 500;

    return props.price + increase;
  };

  const biddingClosed = () => {
    alert("Bidding has closed for this item.");
  };

  return (
    <div className="container my-0 px-0 d-flex justify-content-center align-items-center col-sm-6 col-lg-4 col-xl-3">
      <div className="card border-0">
        <Photos img={props.img} title={props.title} />
        <div className="btn-group d-flex justify-content-between align-items-center">
          {props.user ? (
            <Button
              handleClick={left !== "Bidding Closed" ? sendBid : biddingClosed}
              name={
                props.user.id !== props.highBidderId
                  ? `BID $${newBid()}`
                  : "WINNING"
              }
              color={
                props.user.id !== props.highBidderId ? "primary" : "success"
              }
            />
          ) : (
            <h6 className="mx-auto">**Please log in to bid**</h6>
          )}

          {props.user && props.user.id === props.sellerId && (
            <>
              <EditButton title={props.title} img={props.img} id={props.id} />
              <Button handleClick={deleteItem} name="DELETE" color="danger" />
            </>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center my-0">
          <Title title={props.title} />
          <BidCount bids={props.bids} />
        </div>
        <div className="d-flex justify-content-between align-items-center my-0">
          <CurrentBid price={props.price} />
          <TimeLeft time={left} difference={left === "Bidding Closed" ? 0 : new Date(props.closeDate).getTime() - new Date().getTime()} />
        </div>
        <div>
          <HighBidder name={props.user ? props.highBidder : "******"} />
          <Seller name={props.user ? props.seller : "******"} />
        </div>
      </div>
    </div>
  );
};

export default Item;
