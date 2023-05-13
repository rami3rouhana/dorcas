import { Routes, Route } from 'react-router-dom';
import PunchPage from './pages/Punch';
import ProjectPage from './pages/Project';
import AdminPage from './pages/Admin';

const Main = () => {

  return (
    <Routes>
      <Route path="/" element={<PunchPage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
export default Main;