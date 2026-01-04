// src/GoalSequence.jsx
import React, { useState, useEffect } from 'react';

const GoalSequence = () => {
  const [liveBuffer, setLiveBuffer] = useState([]);
  const [savedSequences, setSavedSequences] = useState([]);
  const [selectedSeq, setSelectedSeq] = useState(null);

  useEffect(() => {
    // 실제 백엔드 주소가 생기면 'ws://...' 부분을 수정하세요.
    const socket = new WebSocket('ws://localhost:8080'); 

    socket.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);

      // 골 감지 로직
      if (newEvent.type_name === 'Shot' && newEvent.result_name === 'Goal') {
        const newEntry = {
          id: `goal-${Date.now()}`,
          playerName: newEvent.player_name_ko,
          data: [...liveBuffer, newEvent] // 4개(이전) + 1개(골)
        };
        setSavedSequences(prev => [newEntry, ...prev]);
      }

      // 큐 업데이트 (최신 4개 유지)
      setLiveBuffer(prev => [...prev, newEvent].slice(-4));
    };

    return () => socket.close();
  }, [liveBuffer]);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ width: '250px', borderRight: '1px solid #ddd' }}>
        <h3>⚽ Goal List</h3>
        {savedSequences.map(seq => (
          <div key={seq.id} onClick={() => setSelectedSeq(seq)} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}>
            {seq.playerName} 득점
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <h3>Sequence Detail</h3>
        {selectedSeq ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedSeq.data.map((d, i) => (
              <div key={i} style={{ padding: '10px', border: '1px solid blue' }}>
                {d.type_name}<br/>{d.player_name_ko}
              </div>
            ))}
          </div>
        ) : <p>골을 선택하세요.</p>}
      </div>
    </div>
  );
};

export default GoalSequence;