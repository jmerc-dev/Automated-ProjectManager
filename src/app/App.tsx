import ProjectView from "./Project/page";
import Home from "./Home/page";
import Landing from "./Landing/page";
import { Test } from "./test";
import Tasks from "./Project/Tasks/page";
import MyTasks from "./MemberViews/My-Tasks/page";
import TeamTasks from "./MemberViews/Teams-Tasks/page";
import Reports from "./Reports/Reports";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/project" element={<ProjectView />} />
        <Route path="/test" element={<Test />} />
        <Route path="/project/:id" element={<ProjectView />} />
        <Route path="/mytasks/:id" element={<MyTasks />} />
        <Route path="/teamtasks/:id" element={<TeamTasks />} />
        <Route path="/reports/:id" element={<Reports projectId={""} />} />
      </Routes>
    </Router>
  );
}

export default App;
