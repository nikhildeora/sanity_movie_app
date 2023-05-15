import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "./navbar.module.css";
import { client } from '../../client';
import { dataContext } from '../../context/dataContext';

const Navbar = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const {getAllMovies} = useContext(dataContext);

  useEffect(() => {
    if(inputValue==""){
        getAllMovies();
    }

    const fetchData = async () => {
      const query = `*[_type == 'movie' && title match $query] | order(title asc)`;
      const params = { query: `*${inputValue}*` };

      try {
        const results = await client.fetch(query, params);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchData();

  }, [inputValue]);


  const getDetails = (id) => {
    getAllMovies(id)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.search_container}>
        <input type="text" id="search-input" placeholder="Search..." value={inputValue} onInput={(e) => setInputValue(e.target.value)} />
        <div style={inputValue!=="" ? {display:"block"} : {display:"none"}} className={styles.suggestion_dropdown}>
            {searchResults.length>0 && searchResults.map((el,i)=>{
              return <div onClick={()=>{
                getDetails(el._id)
              setInputValue(el.title)}} key={i}>{el.title}</div>
            })}
        </div>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
