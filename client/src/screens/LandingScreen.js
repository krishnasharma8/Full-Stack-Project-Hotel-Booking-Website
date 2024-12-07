import React from 'react'
import {Link} from 'react-router-dom'

function LandingScreen() {
  return (
    <div className='row landing justify-content-center'>
      <div className='col-md-9 my-auto text-center' style={{borderRight:'5px solid white'}}>
        <h2 style={{color:'white',fontSize:'130px'}}>Stay-Here</h2>
        <h1 style={{color:'white'}}>"There is only one boss.The Guest"</h1>
        <Link to="/home">
        <button className='btn landingbtn'>Get Started</button>
        </Link>
      </div>
    </div>
  )
}

export default LandingScreen
