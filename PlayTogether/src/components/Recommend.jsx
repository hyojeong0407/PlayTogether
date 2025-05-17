import { useState } from 'react'
import './Recommend.css'

function Recommend({ ownedGames = [], recommendedGames = [], friends = [] }) {
    const [selectedGame, setSelectedGame] = useState(null);

    const handleGameClick = (game) => {
        setSelectedGame(game);
    };

    return (
        <div className='recommend-container'>
            <div className='dashboard'>
                <div className='genre-chart'>[장르별 선호도 그래프]</div>
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
                            >
                                <div>{game.name}</div> {/* 👈 이름만 표시 */}
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
                            >
                                <div>{game.name}</div> {/* 👈 이름만 표시 */}
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
                            <div>이름: {selectedGame.name}</div>
                            <div>장르: {selectedGame.genre}</div>
                            <div>평점: {selectedGame.rating}</div>
                            <div>플랫폼: {selectedGame.platform}</div>
                            <div>플레이어 수: {selectedGame.players}</div>
                        </div>
                    )}

                    <div className='friend-selector'>
                        <h3 className='sub-title'>게임 추천에 포함할 친구 선택</h3>
                        {friends.map((friend, index) => (
                            <div key={friend.id || index} className="friend-checkbox">
                                <input type="checkbox" id={`friend-${index}`} />
                                <label htmlFor={`friend-${index}`}>{friend.nickname}</label>
                            </div>
                        ))}
                        <button className="apply-button">적용</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recommend;