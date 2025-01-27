import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return(
    <div id='homepage'>
        <h2>Get ready to slither your way to victory!</h2>
        <button onClick={()=>{navigate('/game')}}>Start !</button>
    </div>
  )
};



export default HomePage;