import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./home.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { dataContext } from "../../context/dataContext";

export default function Home() {
  const navigate = useNavigate();
  const { FiltByCrewMemb,movies, setMovies, getAllMovies, allCrewMembers,AllCrewMembers } = useContext(dataContext);
  // const [searchParams, setSearchParams] = useSearchParams();
  const [searchName,setSearchName] = useState([]);
  const [changeState,setChangeState] = useState(true);

  useEffect(() => {
    getAllMovies();
    AllCrewMembers();
  }, []);

  useEffect(()=>{
   if(searchName.length==0){
    getAllMovies();
   }

    FiltByCrewMemb(searchName)
  },[changeState])

  const GoToSinglePage = (id) => {
    navigate(`/single/${id}`);
  }

  // for sorting 
  const sortBymovieName = (value) => {
    console.log(value);
    let copyMovie = [...movies];
    if(value=="atoz"){
      copyMovie.sort((a,b)=>{
        if(a.title>b.title){
          return 1;
        }
        else if(a.title<b.title){
          return -1;
        }
        return 0;
      })
      setMovies(copyMovie);
    }
    else if(value=="ztoa"){
      copyMovie.sort((a,b)=>{
        if(a.title>b.title){
          return -1;
        }
        else if(a.title<b.title){
          return 1;
        }
        return 0;
      })
      setMovies(copyMovie);
    }
   
  }

  const sortBymovieYear = (value) => {
    let copyMovie = [...movies];
    if(value=="latest"){
      const SDescending = copyMovie.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      let mydata = new Date(copyMovie[0].releaseDate);
      console.log(mydata);
      setMovies(SDescending);
    }
    else if(value=="oldest"){
      const SAscending = copyMovie.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
      setMovies(SAscending);
    }
  }

  const sortByCrewMember = (e) => {
    
    if(e.target.checked){
      setSearchName([...searchName,e.target.value]);
      setChangeState(!changeState);
    }else if(!e.target.checked){
      let filtArr = searchName.filter((el)=>{
        return el!==e.target.value;
      })
      setSearchName(filtArr);
      setChangeState(!changeState);
    }

  }

  return (
    <div className={styles.home_main_div}>
      <div className={styles.home_sorting}>
        <h1>Sort By ...</h1>
        <div>
          <h2>Movies Name</h2>
          <label>
            <input
              type="radio"
              value="atoz"
              name="moviename"
              onChange={(e)=>sortBymovieName(e.target.value)}
              // checked
            />
            A to Z
          </label>
          <label>
            <input
              type="radio"
              value="ztoa"
              name="moviename"
              onChange={(e)=>sortBymovieName(e.target.value)}
            />
            Z to A
          </label>
        </div>
        <div onClick={(e) => sortBymovieYear(e.target.value)}>
          <h2>Release year</h2>
          <label >
            <input
              type="radio"
              value="latest"
              name="movieyear"
            // checked
            />
            Latest
          </label>
          <label>
            <input
              type="radio"
              value="oldest"
              name="movieyear"
            />
            oldest
          </label>
          
          <div>
            <h2>Crew Member name</h2>
            <div className={styles.crew_member_section}>
            {allCrewMembers.length>0 && allCrewMembers.map((el,i)=>{
                return <label key={i}>
                <input
                  type="checkbox"
                  value={el.name}
                  onChange={(e)=>sortByCrewMember(e)}
                />
                {el.name}
              </label>
            })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.movies_container}>
        {movies.map((movie) => (
          <div onClick={() => GoToSinglePage(movie._id)} className={styles.movie} key={movie._id}>
            <img src={movie.poster} alt={movie.title} />
            <div className={styles.movie_info}>
              <h3>{movie.title}</h3>
              <p>Popularity: {movie.popularity}</p>
              <p>Release Date: {movie.releaseDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
