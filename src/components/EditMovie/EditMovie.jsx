import styles from "./editmovie.module.css";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { dataContext } from '../../context/dataContext';
import { client } from '../../client';
import { v4 as uuidv4 } from 'uuid';


const EditMovie = () => {
  // for edit movie 
  const [crewMembersArray, setCrewMembersArray] = useState([]);
  const [castMembersArray, setCastMembersArray] = useState([]);
  const { allCrewMembers, AllCrewMembers, getMoviesEdit, moviesEdit } = useContext(dataContext);
  const castMemRef = useRef(null);
  const castCharRef = useRef(null);
  const crewMemRef = useRef(null);
  const crewDeparRef = useRef(null);
  const crewJobRef = useRef(null);
  const titleRef = useRef(null);
  const populRef = useRef(null);
  const releaseRef = useRef(null);
  const posterRef = useRef(null);
  const overviewRef = useRef(null);

  // for edit movie and delete movie list 
  const [eachMovieDetail, setEachMovieDetail] = useState({});
  const [editImage, setEditImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEW6WMiSGXgx41Q23c120kSVrt1ZhqxY1icA&usqp=CAU");

  useEffect(() => {
    AllCrewMembers()
    getMoviesEdit()
  }, [])

  const getFormData = () => {

    if (castMembersArray.length == 0 || crewMembersArray.length == 0 || titleRef.current.value == "" || populRef.current.value == "" || releaseRef.current.value == "" || overviewRef.current.value == "") {
      alert("all fields are mandatory");
      return;
    }


    let crewNewArr = crewMembersArray.map((el) => {
      delete el.name;
      return el;
    })
    let castNewArr = castMembersArray.map(el => {
      delete el.name;
      return el;
    })


    let copyObj = { ...eachMovieDetail };
    delete copyObj.poster;
    copyObj.poster = { ...eachMovieDetail.completePoster };
    copyObj.title = titleRef.current.value;
    copyObj.popularity = +populRef.current.value;
    copyObj.releaseDate = releaseRef.current.value;
    copyObj.overview[0].children[0].text = overviewRef.current.value;
    copyObj.crewMembers = [...crewNewArr];
    copyObj.castMembers = [...castNewArr];
    delete copyObj.crewMember;
    delete copyObj.completePoster;
    delete copyObj.slug;
    console.log("copy", copyObj);


    if (posterRef.current.files[0] === undefined) {
      patchMovie(copyObj);
    }else{
      client.assets.upload('image', posterRef.current.files[0])
      .then((res) => {
        copyObj.poster.asset._ref = res._id;
      })
      .then(() => {
        patchMovie(copyObj)
      })
      .catch((err) => console.log(err))
    }

  }

  const patchMovie = (obj) => {
     client.patch(obj._id)
     .set(obj)
     .commit()
     .then((upMovie)=>{
      alert("movie updated succesfully");
      emptyFormAgain();
      console.log("updatedMovie",upMovie);
     })
     .then(()=>getMoviesEdit())
     .catch((err)=>{
      console.log(err);
     })
  }

  const emptyFormAgain = () => {
    setCastMembersArray([]);
    setCrewMembersArray([]);
    titleRef.current.value = "";
    populRef.current.value = "";
    releaseRef.current.value = "";
    posterRef.current.files = [];
    posterRef.current.value = "";
    overviewRef.current.value = "";
    setEditImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEW6WMiSGXgx41Q23c120kSVrt1ZhqxY1icA&usqp=CAU");
  }

  const AddOneCastMember = () => {
    let [name, id] = castMemRef.current.value.trim().split("+");

    let obj = {
      name: name,
      _key: uuidv4(),
      characterName: castCharRef.current.value,
      _type: "castMember",
      person: {
        _ref: id,
        _type: "reference"
      }
    }

    setCastMembersArray([...castMembersArray, obj])
    castCharRef.current.value = "";
    castMemRef.current.value = "";
  }

  const deleteCastMemFromArray = (id) => {
    let filt = castMembersArray.filter((el) => {
      return el.person._ref !== id;
    })
    setCastMembersArray(filt);
  }

  const AddOneCrewMember = () => {
    let [name, id] = crewMemRef.current.value.trim().split("+");

    let obj = {
      name: name,
      _key: uuidv4(),
      department: crewDeparRef.current.value,
      job: crewJobRef.current.value,
      _type: "crewMember",
      person: {
        _ref: id,
        _type: "reference"
      }
    }

    setCrewMembersArray([...crewMembersArray, obj]);
    crewDeparRef.current.value = "";
    crewMemRef.current.value = "";
    crewJobRef.current.value = "";
  }

  const deleteCrewMemFromArray = (id) => {
    let filt = crewMembersArray.filter((el) => {
      return el.person._ref !== id;
    })
    setCrewMembersArray(filt);
  }

  // edit and delete movie 
  const DeleteMentionedMovie = (id) => {
    client.delete(id)
      .then((res) => {
        alert("movie deleted succesfully");
        getMoviesEdit();
      })
      .catch((err) => console.log(err))
  }

  const EditMentionedMovie = (el) => {
    const date = new Date(el.releaseDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    const formattedDate = [year, month, day].join('-');

    console.log(el);
    setEachMovieDetail(el);
    setEachMovieDetail(el);
    setCrewMembersArray(el.crewMember);
    setCastMembersArray(el.castMembers);
    titleRef.current.value = el.title;
    populRef.current.value = el.popularity;
    releaseRef.current.value = formattedDate;
    setEditImage(el.poster);
    overviewRef.current.value = el.overview[0].children[0].text;
  }

  return (
    <div className={styles.editmovie_main_div}>
      <div className={styles.editmovie_first_flex_div}>
        {moviesEdit.length > 0 && moviesEdit.map((el, i) => {
          return (
            <div className={styles.edit_each_movie_div} key={i}>
              <div>
                <img className={styles.edit_div_image} src={el.poster} alt="movie poster" />
                <div>
                  <p>{el.title}</p>
                  <p>ReleaseDate : {el.releaseDate}</p>
                  <p>Popularity : {el.popularity}</p>
                </div>
              </div>
              <div>
                <button onClick={() => EditMentionedMovie(el)}><i class="uil uil-edit"></i></button>
                <button onClick={() => DeleteMentionedMovie(el._id)}><i class="uil uil-trash-alt"></i></button>
              </div>
            </div>
          )
        })}
      </div>

      {/* for edit form  */}
      <div className={styles.main_div}>
        <label for="title">Title:</label>
        <input ref={titleRef} type="text" id="title" name="title" required />

        <label for="releaseDate">Release Date:</label>
        <input ref={releaseRef} type="date" id="releaseDate" name="releaseDate" required />

        <label for="overview">Overview:</label>
        <textarea ref={overviewRef} id="overview" name="overview" rows="4" required></textarea>

        <label for="popularity">Popularity:</label>
        <input ref={populRef} type="number" id="popularity" name="popularity" step="any" required />

        <label for="poster">Poster Image:</label>
        <img style={{ width: "40%" }} src={editImage} alt="sample image" />
        <input ref={posterRef} type="file" id="poster" name="poster" accept="image/*" required />

        <label for="castMembers">Cast Members:</label>
        <div className={styles.badgeContainer}>{castMembersArray.length > 0 && castMembersArray?.map((el, i) => {
          return (
            <span className={styles.badge} key={i}>{el.name} <span onClick={() => deleteCastMemFromArray(el.person._ref)} >x</span> </span>
          )
        })}</div>
        <input ref={castCharRef} type="text" placeholder='type character name' />
        <select ref={castMemRef} id="castMembers" name="castMembers[]" multiple>
          {allCrewMembers.length > 0 && allCrewMembers.map((el, i) => {
            return (
              <option key={i} value={`${el.name}+${el._id}`}>{el.name}</option>
            )
          })}
        </select>
        <button className={styles.tealButton} onClick={() => AddOneCastMember()}>Add Cast Member</button>

        <label for="crewMembers">Crew Members:</label>
        <div className={styles.badgeContainer}>{crewMembersArray.length > 0 && crewMembersArray?.map((el, i) => {
          return (
            <span className={styles.badge} key={i}>{el.name} <span onClick={() => deleteCrewMemFromArray(el.person._ref)} >x</span> </span>
          )
        })}</div>
        <input ref={crewDeparRef} type="text" placeholder='type department name' />
        <input ref={crewJobRef} type="text" placeholder='type job' />
        <select ref={crewMemRef} id="crewMembers" name="crewMembers[]" multiple >
          {allCrewMembers.length > 0 && allCrewMembers.map((el, i) => {
            return (
              <option key={i} value={`${el.name}+${el._id}`}>{el.name}</option>
            )
          })}
        </select>
        <button className={styles.tealButton} onClick={() => AddOneCrewMember()}>Add Crew Member</button>

        <button className={styles.tealButton} onClick={getFormData}>Edit Movie</button>
      </div>
    </div>
  )
}

export default EditMovie;