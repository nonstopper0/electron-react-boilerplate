import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Main from '../windows/main/main';

function Hello() {
  return <Main />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
