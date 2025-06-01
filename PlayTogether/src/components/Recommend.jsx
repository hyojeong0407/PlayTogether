import { useState } from 'react'
import './Recommend.css'
import logo from './PlayTogetherLOGO.png'

function Recommend({ ownedGames: initialOwnedGames = [], recommendedGames = [], friends = [], user, onLogoClick }) {
    const [selectedGame, setSelectedGame] = useState(null);
    const [popupGame, setPopupGame] = useState(null);
    const [selectedFriends, setSelectedFriends] = useState([]); // 선택된 친구 steamId 배열
    const [ownedGames, setOwnedGames] = useState(initialOwnedGames); // 서버에서 받은 게임 목록

    const handleGameClick = (game) => {
        setSelectedGame(game);
    };

    const handleGameDoubleClick = (game) => {
        setPopupGame(game);
    };

    // 체크박스 변경 핸들러
    const handleFriendCheck = (steamId) => {
        setSelectedFriends(prev =>
            prev.includes(steamId)
                ? prev.filter(id => id !== steamId)     // 이미 선택되어 있으면 해제(제거)
                : [...prev, steamId]    // 선택되어 있지 않으면 추가
        );
    };

    // 적용 버튼 클릭 시 서버에 POST 요청
    const handleApply = async () => {
        if (!user || !user.steamId) {
            alert('본인 정보가 없습니다.');
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/game/common', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    me: user.steamId,
                    selectedFriends: selectedFriends
                })
            });
            if (!res.ok) throw new Error('서버 오류');
            const data = await res.json();
            setOwnedGames(data); // [{ appid, name, thumbnail }, ...]
        } catch (e) {
            alert('함께 보유 중인 게임을 불러오지 못했습니다.');
        }
    };

    return (
        <>
        <div className='recommend-container'>
        <img src={logo} alt="로고"
            className='logo' 
            onClick={() => { onLogoClick(); }} 
            style={{cursor:'pointer'}}
            />
            <div className='dashboard'>
                <div className='genre-chart'>[장르별 선호도 그래프]</div>
            </div>

            <div className='content-area'>
                <div className='game-lists'>
                    <div className='owned-games'>
                        <h3 className='sub-title'>함께 보유 중인 게임</h3>
                        {(ownedGames || []).map(game => (
                            <div
                                key={game.appid}
                                className='game-item'
                                onClick={() => handleGameClick(game)}
                                onDoubleClick={() => handleGameDoubleClick(game)}
                            >
                                <img src={game.thumbnail} alt={game.name} style={{width: '80px', marginRight: '8px'}} />
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
                                src={selectedGame.thumbnail}
                                alt='게임 썸네일'
                            />
                            <div>{selectedGame.name}</div>
                            <div>장르: {selectedGame.genre}</div>
                            <div>평점: {selectedGame.rating}</div>
                            <div>플랫폼: {selectedGame.platform}</div>
                            <div>플레이어 수: {selectedGame.players}</div>
                        </div>
                    )}

                    <div className='friend-selector'>
                        <h3 className='sub-title'>게임 추천에 포함할 친구 선택</h3>
                        {friends.map((friend, index) => (
                            <div key={friend.steamId || index} className="friend-checkbox">
                                <input
                                    type="checkbox"
                                    id={`friend-${index}`}
                                    checked={selectedFriends.includes(friend.steamId)}
                                    onChange={() => handleFriendCheck(friend.steamId)}
                                />
                                <label htmlFor={`friend-${index}`}>{friend.name}</label>
                            </div>
                        ))}
                        <button className="apply-button" onClick={handleApply}>적용</button>
                    </div>
                </div>
            </div>
            {popupGame && (
                <div className='popup-overlay' onClick={() => setPopupGame(null)}>
                    <div className="popup-window" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setPopupGame(null)}>돌아가기</button>
                        <div className="popup-header">
                            <img src={popupGame.thumbnail} alt="썸네일" className="popup-thumbnail" />
                            <button className="steam-download">Steam download</button>
                        </div>
                        <div className='popup-body'>
                            <div className="popup-section">
                                <h4>게임설명</h4>
                                <div className="popup-description">
                                    {popupGame.description || '게임설명글'}
                                </div>
                            </div>
                            <div className="popup-row">
                                <div className="popup-video-box">
                                    <h4>관련 영상</h4>
                                    <button className="popup-video-button">▶</button>
                                </div>
                                <div className="popup-friend-box">
                                    <h4>이 게임을 가진 친구</h4>
                                    <ul className="popup-friend-list">
                                        {(popupGame.friends || friends).map((f, i) => (
                                            <li key={i}>{f.name}</li>
                                        ))}
                                    </ul>
                                </div>
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