import React from 'react';
import styles from './admin.module.css';
import {Link} from "react-router-dom";

function Admin() {
  return (
    <div className={styles.button_container}>
      <Link to={"/add"}>
      <button className={styles.add_button}>Add Movie <i className="uil uil-plus"></i></button>
      </Link>
      <Link to={"/edit"}>
      <button className={styles.edit_button}>Edit and Delete Movie <i className="uil uil-pen"></i></button>
      </Link>
    </div>
  );
}

export default Admin;
