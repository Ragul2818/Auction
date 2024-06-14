import React, { useState, useEffect } from 'react';
import AuctionItem from './AuctionItem';
import Navbar from './Navbar';
import Footer from './Footer';

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState(null);

  // Fetching all auction items
  const getAll = () => {
    fetch('/all')
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  // Checking if the user is logged in
  const isLoggedIn = () => {
    fetch('/loggedin', {
      method: 'GET',
      credentials: 'include', // Ensure cookies are included
    })
      .then((res) => res.json())
      .then((data) => setLoggedIn(data));
  };

  useEffect(() => {
    getAll();
    isLoggedIn();

    // Setting up the interval for the real-time clock
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const sendBid = (itemID) => {
    let newBid = items.filter((item) => item.id === itemID)[0];
    const { bids, price } = newBid;
    let increase = 0;

    if (price < 10) increase = 1;
    else if (price < 50) increase = 2;
    else if (price < 100) increase = 5;
    else if (price < 500) increase = 10;
    else if (price < 1000) increase = 25;
    else if (price < 10000) increase = 100;
    else increase = 500;

    let updatedBid = {
      bids: bids + 1,
      price: price + increase,
      id: itemID,
      highBidderID: loggedIn.id,
    };

    fetch('/bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBid),
      credentials: 'include', // Ensure cookies are included
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        getAll(); // Refresh immediately
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  const deleteItem = (id) => {
    fetch('/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: id,
      credentials: 'include', // Ensure cookies are included
    })
      .then((response) => response)
      .then((data) => {
        console.log('Success:', data);
        getAll();
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  return (
    <div>
      <Navbar user={loggedIn} setUser={setLoggedIn} />
      <div className='container'>
        <div className='container'>
          <h4 className='text-center'>Current Date and Time:</h4>
          <h5 className='text-center'>
            {currentDate.toLocaleString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
            })}
          </h5>
        </div>

        <div className='row'>
          {items
            .map((item, index) => (
              <AuctionItem
                key={item.id}
                id={item.id}
                title={item.title}
                bids={item.bids}
                price={item.price}
                highBidder={item.highBidder}
                highBidderId={item.highBidderId}
                seller={item.seller}
                sellerId={item.sellerId}
                closeDate={item.closeDate}
                img={item.img}
                index={index}
                sendBid={sendBid}
                deleteItem={deleteItem}
                user={loggedIn}
              />
            ))
            .sort()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
