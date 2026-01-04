// src/App.jsx
import GoalSequence from './GoalSequence'; // 방금 만든 파일 불러오기

function App() {
  return (
    <div className="App">
      <header style={{ padding: '10px', background: '#282c34', color: 'white' }}>
        <h1>K-League Data Analysis</h1>
      </header>
      <main>
        {/* 우리가 만든 골 시퀀스 컴포넌트 배치 */}
        <GoalSequence />
      </main>
    </div>
  );
}

export default App;