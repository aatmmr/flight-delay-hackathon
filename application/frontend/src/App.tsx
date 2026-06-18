import { Router, Route } from './components/Router';
import { Layout } from './components/Layout';
import { SearchPage } from './pages/SearchPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MapPage } from './pages/MapPage';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Route path="/" element={<SearchPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/map" element={<MapPage />} />
      </Layout>
    </Router>
  );
}

export default App;
