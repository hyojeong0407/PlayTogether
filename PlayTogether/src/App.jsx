import { useState } from 'react'
import './App.css'

function App() {
  return (
    <>
    <div className='home_text'>
      <div className='title'> 
        <h1>Play Together</h1>
      </div>
      <div className='explanation'>
        <h2>스팀 친구들과 함께할 멀티플레이 게임, 지금 바로 찾아보세요!</h2>
      </div>
    </div> 

    <div className='login'>
        <input className='input_login' type='text' placeholder='Steam 아이디 입력' /> <br />
        <button className='login_button'>Q</button>
    </div>  
    </>
  )
}

export default App

