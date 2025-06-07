import { useState } from 'react'
import './App.css'
import Recommend from './components/Recommend'

// 테스트할 때 Allow CORS 확장 프로그램 사용 바람!

function App() {
  const [showRecommend, setShowRecommend] = useState(false);
  const [steamId, setSteamId] = useState('');
  const [user, setUser] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'DF29C0FC712EA00868590BCB7AF48907';
  const ownedGames = [];
  const recommendedGames = [];

  const handleClick = async () => {
  setLoading(true)
  try {
    // 1. 친구 ID 목록 가져오기
    const friendListRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${API_KEY}&steamid=${steamId}`
    )
    const friendListData = await friendListRes.json()
    const friendIds = (friendListData.friendslist?.friends || []).map(f => f.steamid)

    // 2. 본인 + 친구 닉네임 정보 가져오기
    const allIds = [steamId, ...friendIds]
    let user = null
    let friendsInfo = []
    if (allIds.length > 0) {
      const summariesRes = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${allIds.slice(0, 100).join(',')}`
      )
      const summariesData = await summariesRes.json()
      const players = summariesData.response.players || []
      // 본인 정보
      user = players.find(p => p.steamid === steamId)
        ? {
            steamId: steamId,
            name: players.find(p => p.steamid === steamId).personaname, 
          }
        : { steamId, name: '' }
      // 친구 정보
      friendsInfo = players
        .filter(p => p.steamid !== steamId)
        .map(player => ({
          steamId: player.steamid,
          name: player.personaname,
        }))
    }
    setUser(user)
    setFriends(friendsInfo)
    setShowRecommend(true)
  } catch (e) {
    alert('친구 목록을 불러오지 못했습니다.')
  }
  setLoading(false)
}

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
            <input
              className='input_login'
              type='text'
              placeholder='Steam id 입력'
              value={steamId}
              onChange={e => setSteamId(e.target.value)}
            /> <br />
            <button className='login_button' onClick={handleClick} disabled={loading}>
              {loading ? '불러오는 중...' : 'Q'}
            </button>
          </div> 
        </>
      ) : (
        <Recommend
          ownedGames={ownedGames}
          recommendedGames={recommendedGames}
          user={user}
          friends={friends}
          onLogoClick={() => setShowRecommend(false)} 
        />
      )}  
    </>
  )
}

export default App

