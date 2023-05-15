import React from 'react';
import {Route,Routes} from "react-router-dom";
import Home from './Home/Home';
import SingleMovie from './SingleMovie/SingleMovie';
import Admin from './Admin/Admin';
import DeleteMovie from './DeleteMovie/DeleteMovie';
import EditMovie from './EditMovie/EditMovie';
import AddMovie from './AddMovie/AddMovie';


const AllRouter = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/single/:id' element={<SingleMovie />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/delete' element={<DeleteMovie />} />
        <Route path='/edit' element={<EditMovie />} />
        <Route path='/add' element={<AddMovie />} />
    </Routes>
  )
  }

export default AllRouter; 