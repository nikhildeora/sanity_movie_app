import { createContext, useState } from "react";
import axios from "axios";
import { client } from "../client";

export const dataContext = createContext();


export const DataContextProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);
    const [movieDetail, setMovieDetail] = useState({});
    const [allCrewMembers, setAllCrewMembers] = useState([]);
    const [moviesEdit, setMoviesEdit] = useState([]);

    const getMoviesEdit = () => {
        axios.get(`https://ect1krw5.api.sanity.io/v2021-10-21/data/query/production?query=%0A*%5B_type%20%3D%3D%20%22movie%22%5D%7B%0A%20%20%20%20title%2C%0A%20%20%20%20%22completePoster%22%20%3A%20poster%2C%20%20%0A%20%20%20%20%22poster%22%20%3A%20poster.asset-%3E%20url%2C%0A%20%20%20%20%22crewMember%22%20%3A%20crewMembers%5B_type%3D%3D%22crewMember%22%5D%7B%0A%20%20%20%20%20%20...%2C%0A%20%20%20%20%20%20department%2C%0A%20%20%20%20%20%20job%2C%20%20%0A%20%20%20%20%20%20%22name%22%20%3A%20person-%3E%20name%0A%20%20%20%20%7D%2C%0A%20%20%20_id%2C%0A%20%20%20%22slug%22%20%3A%20slug.current%2C%0A%20%20%20popularity%2C%0A%20%20%20releaseDate%2C%0A%20%20%20%22castMembers%22%20%3A%20castMembers%5B_type%3D%3D%22castMember%22%5D%7B%0A%20%20%20%20%20...%2C%20%0A%20%20%20%20%20%20characterName%2C%0A%20%20%20%20%20%20%22name%22%20%3A%20person-%3E%20name%20%20%0A%20%20%20%7D%2C%0A%20%20%20overview%20%0A%7D%20`, {
            headers: {
                Authorization: "Bearer skk8twsM11IDx33Ro36CttEolWORnQydr17qWD0tKt4BBNowuWMum54q4ceULwaSoTR2Q9dQCxWPdxsbbE8SPXW4Q7Kn81lYPSkpATFykzEpgsDSVBf26NAWLNCLcFJLp5mIb9L9Y1Ay7qgXQ9hoJoOnveHFmf5v0sKtp1jja0IroYr53nDN"
            }
        }).then((response) => {
            setMoviesEdit(response.data.result);
            console.log(response.data.result);
        });
    }
    
    const FiltByCrewMemb = (crews) => {
        let names = [...crews];
        console.log(names);
        // const names = ['David Giler', 'James Horner', 'Jessica Chastain', 'Sarah Finn'];

        client.fetch(`*[_type == "movie" && (${names.map((name) => `'${name}' in crewMembers[].person->name`).join(" || ")})]{
        title,
         "poster" : poster.asset-> url,
         "crewMember" : crewMembers[_type=="crewMember"]{
           department,
           job,  
           "name" : person-> name,
           "image" : person-> image.asset-> url  
         },
        _id,
        "slug" : slug.current,
        popularity,
        releaseDate,
        "castMembers" : castMembers[_type=="castMember"]{
           characterName,
           "name" : person-> name,
           "image" : person-> image.asset-> url  
        },
        overview 
     }`)
     .then((res) => setMovies(res))
     .catch((err)=>console.log(err))
    }


    const getAllMovies = (id) => {

        axios.get(id === undefined ? "https://ect1krw5.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%20%3D%3D%20%22movie%22%5D%7B%0A%20%20%20%20title%2C%0A%20%20%20%20%22poster%22%20%3A%20poster.asset-%3E%20url%2C%0A%20%20%20_id%2C%0A%20%20%20%22slug%22%20%3A%20slug.current%2C%0A%20%20%20popularity%2C%0A%20%20%20releaseDate%2C%0A%20%20%20overview%0A%7D%20" : `https://ect1krw5.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%20%3D%3D%20%22movie%22%20%26%26%20_id%3D%3D%22${id}%22%5D%7B%0A%20%20%20%20title%2C%0A%20%20%20%20%22poster%22%20%3A%20poster.asset-%3E%20url%2C%0A%20%20%20%20%22crewMember%22%20%3A%20crewMembers%5B_type%3D%3D%22crewMember%22%5D%7B%0A%20%20%20%20%20%20department%2C%0A%20%20%20%20%20%20job%2C%20%20%0A%20%20%20%20%20%20%22name%22%20%3A%20person-%3E%20name%2C%0A%20%20%20%20%20%20%22image%22%20%3A%20person-%3E%20image.asset-%3E%20url%20%20%0A%20%20%20%20%7D%2C%0A%20%20%20_id%2C%0A%20%20%20%22slug%22%20%3A%20slug.current%2C%0A%20%20%20popularity%2C%0A%20%20%20releaseDate%2C%0A%20%20%20%22castMembers%22%20%3A%20castMembers%5B_type%3D%3D%22castMember%22%5D%7B%0A%20%20%20%20%20%20characterName%2C%0A%20%20%20%20%20%20%22name%22%20%3A%20person-%3E%20name%2C%0A%20%20%20%20%20%20%22image%22%20%3A%20person-%3E%20image.asset-%3E%20url%20%20%0A%20%20%20%7D%2C%0A%20%20%20overview%20%0A%7D%20`, {
            headers: {
                Authorization: "Bearer skk8twsM11IDx33Ro36CttEolWORnQydr17qWD0tKt4BBNowuWMum54q4ceULwaSoTR2Q9dQCxWPdxsbbE8SPXW4Q7Kn81lYPSkpATFykzEpgsDSVBf26NAWLNCLcFJLp5mIb9L9Y1Ay7qgXQ9hoJoOnveHFmf5v0sKtp1jja0IroYr53nDN"
            }
        }).then((response) => {
            setMovies(response.data.result);
            console.log(response.data.result);
        });
    }

    const getSingleMovie = (id) => {
        axios.get(`https://ect1krw5.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%20%3D%3D%20%22movie%22%20%26%26%20_id%3D%3D%22${id}%22%5D%7B%0A%20%20%20%20title%2C%0A%20%20%20%20%22poster%22%20%3A%20poster.asset-%3E%20url%2C%0A%20%20%20%20%22crewMember%22%20%3A%20crewMembers%5B_type%3D%3D%22crewMember%22%5D%7B%0A%20%20%20%20%20%20department%2C%0A%20%20%20%20%20%20job%2C%20%20%0A%20%20%20%20%20%20%22name%22%20%3A%20person-%3E%20name%2C%0A%20%20%20%20%20%20%22image%22%20%3A%20person-%3E%20image.asset-%3E%20url%20%20%0A%20%20%20%20%7D%2C%0A%20%20%20_id%2C%0A%20%20%20%22slug%22%20%3A%20slug.current%2C%0A%20%20%20popularity%2C%0A%20%20%20releaseDate%2C%0A%20%20%20%22castMembers%22%20%3A%20castMembers%5B_type%3D%3D%22castMember%22%5D%7B%0A%20%20%20%20%20%20characterName%2C%0A%20%20%20%20%20%20%22name%22%20%3A%20person-%3E%20name%2C%0A%20%20%20%20%20%20%22image%22%20%3A%20person-%3E%20image.asset-%3E%20url%20%20%0A%20%20%20%7D%2C%0A%20%20%20overview%20%0A%7D%20`, {
            headers: {
                Authorization: "Bearer skk8twsM11IDx33Ro36CttEolWORnQydr17qWD0tKt4BBNowuWMum54q4ceULwaSoTR2Q9dQCxWPdxsbbE8SPXW4Q7Kn81lYPSkpATFykzEpgsDSVBf26NAWLNCLcFJLp5mIb9L9Y1Ay7qgXQ9hoJoOnveHFmf5v0sKtp1jja0IroYr53nDN"
            }
        }).then((response) => {
            setMovieDetail(response.data.result[0]);
        });
    }

    const AllCrewMembers = () => {
        axios.get(`https://ect1krw5.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D%22person%22%5D%7B%0A%20%20name%2C%0A%20%20%20%20_id%0A%7D%0A%20%0A`, {
            headers: {
                Authorization: "Bearer skk8twsM11IDx33Ro36CttEolWORnQydr17qWD0tKt4BBNowuWMum54q4ceULwaSoTR2Q9dQCxWPdxsbbE8SPXW4Q7Kn81lYPSkpATFykzEpgsDSVBf26NAWLNCLcFJLp5mIb9L9Y1Ay7qgXQ9hoJoOnveHFmf5v0sKtp1jja0IroYr53nDN"
            }
        }).then((response) => {
            setAllCrewMembers(response.data.result);
        });
    }

    return (
        <dataContext.Provider value={{getMoviesEdit, moviesEdit, FiltByCrewMemb, movies, setMovies, getAllMovies, movieDetail, getSingleMovie, allCrewMembers, AllCrewMembers }}>
            {children}
        </dataContext.Provider>
    )
}

