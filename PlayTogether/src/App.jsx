import { useState } from 'react'
import './App.css'
import Recommend from './components/Recommend'
import game4 from './components/game-4.png'

// 테스트용 데이터
const ownedGames = [
  { id: 1, name: '테스트 게임', thumbnail: game4 }
];
const recommendedGames = [
  { id: 2, name: '추천 게임', thumbnail: game4 }
];
const friends = [
  { id: 'f1', nickname: '철수' }
];

function App() {
  const [showRecommend, setShowRecommend] = useState(false);

  const handleClick = () => {
    setShowRecommend(true);
  };

  return (
    <>
    {!showRecommend ? (
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
            <button className='login_button' onClick={handleClick}>Q</button>
          </div>  
        </>
      ) : (
        <Recommend
          ownedGames={ownedGames}
          recommendedGames={recommendedGames}
          friends={friends}
        />
      )}  
    </>
  )
}

export default App

