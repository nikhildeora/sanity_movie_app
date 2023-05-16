import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from "./addmovie.module.css"
import { dataContext } from '../../context/dataContext';
import { client } from '../../client';
import { v4 as uuidv4 } from 'uuid';

const AddMovie = () => {
  const [crewMembersArray, setCrewMembersArray] = useState([]);
  const [castMembersArray, setCastMembersArray] = useState([]);
  const { allCrewMembers, AllCrewMembers } = useContext(dataContext);
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

  useEffect(() => { AllCrewMembers() }, [])

  const getFormData = () => {
    
    if(castMembersArray.length==0 || crewMembersArray.length==0 || titleRef.current.value=="" || populRef.current.value == "" || releaseRef.current.value == "" || posterRef.current.files.length==0 || overviewRef.current.value == ""){
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

    let newStr = titleRef.current.value.toLowerCase();
    let ArrOfMovieName = newStr.trim().split(" ");
    let strofslug = ArrOfMovieName.join("-");
    console.log(strofslug);

    let obj = {
      _type: "movie",
      title: titleRef.current.value,
      popularity: +populRef.current.value,
      releaseDate: releaseRef.current.value,
      slug: {
        source: "title",
        current: strofslug,
        _type: "slug"
      },
      overview: [
        {
          _key: uuidv4(),
          _type: 'block',
          children: [
            {
              _key: uuidv4(),
              _type: 'span',
              text: overviewRef.current.value,
            },
          ],
          markDefs: []
        }
      ],
      poster: {
        _type: "image",
        asset: {
          _ref: "id of image",
          _type: "reference"
        }
      },
      castMembers: [...castNewArr],
      crewMembers: [...crewNewArr]
    }

    client.assets.upload('image', posterRef.current.files[0])
      .then((res) => {
        obj.poster.asset._ref = res._id
      })
      .then(() => {
        client.create(obj)
          .then((res) => {
            console.log(res)
            alert("movie created successfully");
            setCastMembersArray([]);
            setCrewMembersArray([]);
            titleRef.current.value = "";
            populRef.current.value = "";
            releaseRef.current.value = "";
            posterRef.current.files = [];
            posterRef.current.value =  "";
            overviewRef.current.value = "";
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))

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

  return (
    
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

      <button className={styles.tealButton} onClick={getFormData}>Add Movie</button>
    </div>

  )
}

export default AddMovie;