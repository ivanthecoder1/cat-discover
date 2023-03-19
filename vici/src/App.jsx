import { useState } from 'react'
import './App.css'
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  // inputs for the cat api call
  const [imageSrc, setImageSrc] = useState('');
  const [breed, setBreed] = useState('');
  const [origin, setOrigin] = useState('');
  const [lifespan, setLife] = useState('');
  const [banList, setBanList] = useState([]);

  //  async keyword is written in front of a function declaration to turn it into an asynchronous function
  const fetchCat = async () => { // expects something within it to always returns a promise
    // promise: objects that represent the eventual completion or failure of an 
    // asynchronous operation and allow you to attach callbacks to handle the results. The promise would be the fetch
    try {
      // create query string with has_breeds and API key
      let query = `https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=${ACCESS_KEY}`;

      // if there are items in the ban list, add them to the query string to exclude them from the search
      if (banList.length > 0) {
        query += '&';
        banList.forEach(attr => {
          query += `exclude_${attr}=1&`;
        });
      }

      // make API call with constructed query string
      const response = await fetch(query); // await here pauses the fetch until the query is fulfilled or rejected
      const json = await response.json();
      if (json.length > 0 && json[0].url != null) { // make sure the json object is valid
        // set image source, breed, origin, and lifespan based on API response
        setImageSrc(json[0].url);
        setBreed(json[0].breeds[0].name);
        setOrigin(json[0].breeds[0].origin)
        setLife(json[0].breeds[0].life_span)
      }
    } catch (error) {
      // catch and log any errors
      console.error(error);
    }
  }
  // Add input attribute to ban list
  const handleBan = (attribute) => {
    if (!banList.includes(attribute)) { // if attribute is not in list, then add it
      setBanList([...banList, attribute]); // create a new list with original ban list, with new attribute added
    }
  }

  // handler for removing an attribute from the ban list
  const handleUnban = (attribute) => {
    setBanList(banList.filter(attr => attr !== attribute));
  }

  return (
    <div>
      <div className="main-container">
        <h1>Cats</h1>
        <h2>Discover the cat of your dreams</h2>
        <img src={imageSrc} alt="Cat" />
        {/* Attribute buttons when clicked are added to our ban list */}
        <div>
          <button types="attribute" class="attribute-buttons" onClick={() => handleBan(`${breed}`)}>{breed} </button>
          <button types="attribute" class="attribute-buttons" onClick={() => handleBan(`${origin}`)}>{origin} </button>
          <button types="attribute" class="attribute-buttons" onClick={() => handleBan(`${lifespan}`)}>{lifespan} years </button>
        </div>
        <p></p>
        {/* Get a new cat */}
        <button onClick={fetchCat}>Discover</button>
      </div>
      <div className='banList'>
        <h2>Ban List</h2>
        <p>Select an attribute in your listing to ban it</p>
        {/* Use map to output each banned attribute in our ban list as a button */}
        {/* map() method creates a new array populated with the results 
        of calling a provided function on every element in the calling array. */}
        {/* Clicking on banned attribute will remove it from banned list */}
        {banList.map((attr, index) => <button class="banned-button" onClick={() => handleUnban(attr)} key={index}>{attr} </button>)}
      </div>
    </div>
  )
}

export default App



