import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {PortableText} from "@portabletext/react";
import styles from "./singleMovie.module.css";
import { dataContext } from '../../context/dataContext';

const SingleMovie = () => {
    const { id } = useParams();
    const {movieDetail,getSingleMovie} = useContext(dataContext);

    useEffect(() => {
        getSingleMovie(id);
    }, [])

    return (
        <div className={styles.movie_container}>
            <div className={styles.poster_container}>
                <img src={movieDetail.poster} alt={movieDetail.title} />
            </div>
            <div className={styles.info_container}>
                <h1>{movieDetail.title}</h1>
                <div className={styles.crew_container}>
                    <h2>Crew Members</h2>
                    <div>
                        {movieDetail.crewMember && movieDetail.crewMember?.map((el, i) => {
                            return <div key={i}>
                                <img src={el.image ? el.image : "https://www.nicepng.com/png/detail/115-1150821_default-avatar-comments-sign-in-icon-png.png"} alt={el.name} />
                                <h2>{el.name}</h2>
                                <p>Role: {el.job}</p>
                                <p> Department : {el.department}</p>
                            </div>
                        })}
                    </div>
                </div>
                <div className={styles.cast_container}>
                    <h2>Cast Members</h2>
                    <div>
                        {movieDetail.castMembers && movieDetail.castMembers?.map((el, i) => {
                            return <div key={i}>
                                <img src={el.image ? el.image : "https://www.nicepng.com/png/detail/115-1150821_default-avatar-comments-sign-in-icon-png.png"} alt={el.name} />
                                <h2>{el.name}</h2>
                                <p>Character : {el.characterName}</p>
                            </div>
                        })}
                    </div>
                </div>
                <div className={styles.overview_container}>
                    <h2>Overview</h2>
                    <PortableText value={movieDetail.overview}  />
                    <p>Popularity : {movieDetail.popularity}</p>
                </div>
            </div>
        </div>

    )
}

export default SingleMovie;