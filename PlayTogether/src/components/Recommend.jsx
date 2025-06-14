import { useState } from 'react';
import './Recommend.css';
import logo from './PlayTogetherLOGO.png';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function Recommend({ user, friends, onLogoClick }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [popupGame, setPopupGame] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [ownedGames, setOwnedGames] = useState([]);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [isApplying, setIsApplying] = useState(false);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleGameDoubleClick = (game) => {
    setPopupGame(game);
  };

  const handleFriendCheck = (steamId) => {
    setSelectedFriends(prev =>
      prev.includes(steamId)
        ? prev.filter(id => id !== steamId)
        : [...prev, steamId]
    );
  };

  const handleApply = async () => {
    if (!user || !user.steamId) {
      alert('본인 정보가 없습니다.');
      return;
    }
    setIsApplying(true);
    try {
      const res = await fetch('http://localhost:8080/game/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          me: user.steamId,
          selectedFriends: selectedFriends
        })
      });
      if (!res.ok) throw new Error('서버 오류');
      const data = await res.json();
      setOwnedGames(data.common || []);
      setRecommendedGames(data.recommend || []);
    } catch (e) {
      alert('추천 게임을 불러오지 못했습니다.');
    }
    setIsApplying(false);
  };

  // 장르별 선호도 계산
  const getGenreData = () => {
    const genreCount = {};

    recommendedGames.forEach(game => {
      const genres = Array.isArray(game.genres) ? game.genres : [game.genres];
      genres.forEach(genre => {
        if (genre) {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        }
      });
    });

    return Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) 
      .map(([genre, count]) => ({ genre, count }));
  };

  return (
    <>
      <div className='recommend-container'>
        <img 
          src={logo} 
          alt="로고"
          className='logo' 
          onClick={onLogoClick}
          style={{cursor: 'pointer'}}
        />
        
        <div className='dashboard'>
          <div className='genre-chart'>
            <h3 className='sub-charttitle'>추천게임별 장르 분포도</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getGenreData()}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="genre" type="category" />
                <Bar dataKey="count" fill="#82ca9d" />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='content-area'>
          <div className='game-lists'>
            <div className='owned-games'>
              <h3 className='sub-title'>함께 보유 중인 게임</h3>
              {(ownedGames || []).map(game => (
                <div
                  key={game.id}
                  className='game-item'
                  onClick={() => handleGameClick(game)}
                  onDoubleClick={() => handleGameDoubleClick(game)}
                >
                  <img
                    src={game.background_image}
                    alt={game.name}
                    style={{width: '200px', marginBottom: '10px', marginRight: '8px'}}
                  />
                  <div>{game.name}</div>
                </div>
              ))}
            </div>
            <div className='recommended-games'>
              <h3 className='sub-title'>추천 게임</h3>
              {(recommendedGames || []).map(game => (
                <div
                  key={game.id}
                  className='game-item'
                  onClick={() => handleGameClick(game)}
                  onDoubleClick={() => handleGameDoubleClick(game)}
                >
                  <img
                    src={game.background_image}
                    alt={game.name}
                    style={{width: '200px', marginBottom: '10px', marginRight: '8px'}}
                  />
                  <div>{game.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className='right-panel'>
            {selectedGame && (
              <div className='game-detail'>
                <h3 className='sub-title'>게임 정보</h3>
                <img
                  className='detail-thumbnail'
                  src={selectedGame.background_image}
                  alt='게임 썸네일'
                />
                <div style={{borderBottom: '1px solid #d9d9d9'}} />
                <div className='detail-title'>{selectedGame.name}</div><br/>
                {selectedGame.sharedFriendIds && (
                  <div className='detail-friend'><strong>함께 보유한 친구:</strong> {selectedGame.sharedFriendIds.join(', ')}</div>
                )}<br/>
                <div><strong>장르:</strong> {(Array.isArray(selectedGame.genres) ? selectedGame.genres.join(', ') : selectedGame.genres)}</div>
                <div><strong>평점:</strong> {selectedGame.rating}</div>
                <div><strong>공식 웹사이트:</strong> {selectedGame.website ? selectedGame.website : '없음'}</div>
              </div>
            )}
            <div className='friend-selector'>
              <h3 className='sub-title'>게임 추천에 포함할 친구 선택</h3>
              {friends.map((friend, index) => (
                <div key={friend.steamId || index} className="friend-checkbox">
                  <input
                    type="checkbox"
                    id={`friend-${index}`}
                    name={`friend-${index}`}
                    checked={selectedFriends.includes(friend.steamId)}
                    onChange={() => handleFriendCheck(friend.steamId)}
                  />
                  <label htmlFor={`friend-${index}`}>{friend.name}</label>
                </div>
              ))}
              <button className="apply-button" onClick={handleApply} disabled={isApplying}>
                {isApplying ? '적용 중...' : '적용'}
              </button>
            </div>
          </div>
        </div>

        {popupGame && (
          <div className='popup-overlay' onClick={() => setPopupGame(null)}>
            <div className="popup-window" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setPopupGame(null)}>돌아가기</button>
              <div className="popup-header">
                <img
                  src={popupGame.background_image}
                  alt="썸네일"
                  className="popup-thumbnail"
                />
                <div>
                  {popupGame.website ? (
                    <a
                      className='steam-download'
                      href={popupGame.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {popupGame.website}
                    </a>
                  ) : null}
                </div>
              </div>
              <div className='popup-body'>
                <div className="popup-section">
                  <div className='detail-title'>{popupGame.name}</div><br/>
                  <div><strong>장르:</strong> {(Array.isArray(popupGame.genres) ? popupGame.genres.join(', ') : popupGame.genres)}</div>
                  <div><strong>평점:</strong> {popupGame.rating}</div><br/>
                  <h4>게임설명</h4>
                  <div className="popup-description">
                    {popupGame.description || '게임설명글'}
                  </div>
                </div>
                <div className="popup-row">
                  {popupGame.sharedFriendIds && popupGame.sharedFriendIds.length > 0 && (
                    <div className="popup-friend-box">
                      <h4>이 게임을 가진 친구</h4>
                      <ul className="popup-friend-list">
                        {popupGame.sharedFriendIds.map((name, i) => (
                          <li key={i}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Recommend;
