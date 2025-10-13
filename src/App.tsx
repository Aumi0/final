import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ClockComponent from './components/Clock';
import Sidebar from './components/sidebar';
import NotesPage from './pages/page'; // Create this component

function App() {
  return (
    <>
      <div className="app-container">
        <Sidebar>
          
          <Link to="/">Home</Link>
          <Link to="/notes">Notes</Link>
        </Sidebar>
        
        <Routes>
          <Route path="/" element={
            <>
              <header className="app-header">
                <div className="App">
                  <h1>注記</h1>
                </div>
              </header>

              <div className="clock-container">
                <ClockComponent
                  showSeconds={true}
                  showDate={true}
                  timeFormat="12h"
                />
              </div>
            </>
          } />
          
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </div>
      
      <div style={{padding:'20px', textAlign:'center'}}>
      </div>
    </>
  );
}

export default App;