import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import AnalysisPage from "./pages/AnalysisPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalysisPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Layout>
  );
}
