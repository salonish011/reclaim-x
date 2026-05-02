import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import ReportLost  from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import Profile     from './pages/Profile';
import ItemMatches from './pages/ItemMatches';
import BrowseItems from './pages/BrowseItems';
import Chat        from './pages/Chat';
import NotFound    from './pages/NotFound';

import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public pages */}
          <Route path="/"         element={<Login />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private pages — must be logged in */}
          <Route path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/report-lost"
            element={<PrivateRoute><ReportLost /></PrivateRoute>} />
          <Route path="/report-found"
            element={<PrivateRoute><ReportFound /></PrivateRoute>} />
          <Route path="/profile"
            element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/matches"
            element={<PrivateRoute><ItemMatches /></PrivateRoute>} />
          <Route path="/browse"
            element={<PrivateRoute><BrowseItems /></PrivateRoute>} />
          <Route path="/chat"
            element={<PrivateRoute><Chat /></PrivateRoute>} />

          {/* 404 — catches any unknown URL */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;