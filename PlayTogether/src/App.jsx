import { useState, useEffect } from 'react'
import './App.css'
import Recommend from './components/Recommend'

function App() {
  const [showRecommend, setShowRecommend] = useState(false);
  const [steamId, setSteamId] = useState('');
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // 새로고침/창 닫힘 시 DB 초기화
  useEffect(() => {
    const handleBeforeUnload = async () => {
      setIsResetting(true);
      try {
        await fetch('http://localhost:8080/api/steam/init', { method: 'POST' });
      } catch (e) {
        console.error('초기화 실패:', e);
      } finally {
        setIsResetting(false);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // 홈 화면으로 돌아갈 때 DB 초기화
  const handleLogoClick = async () => {
    setIsResetting(true);
    try {
      await fetch('http://localhost:8080/api/steam/init', { method: 'POST' });
      setShowRecommend(false);
    } catch (e) {
      alert('초기화 실패');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      // 백엔드 API 호출 (/user/friend/{steamId})
      const res = await fetch(`http://localhost:8080/user/friend/${steamId}`);
      if (!res.ok) throw new Error('서버 오류');
      const data = await res.json();
      
      setUser(data.user);
      setFriends(data.friends);
      setShowRecommend(true);
    } catch (e) {
      alert('친구 목록을 불러오지 못했습니다.');
    }
    setLoading(false);
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
              name="steamId"
              id="steamIdInput"
            /> <br />
            <button 
              className='login_button' 
              onClick={handleClick} 
              disabled={loading || isResetting}
            >
              {loading ? '불러오는 중...' : isResetting ? '초기화 중...' : 'Q'}
            </button>
          </div> 
        </>
      ) : (
        <Recommend
          user={user}
          friends={friends}
          onLogoClick={handleLogoClick}
        />
      )}  
    </>
  )
}

export default App
