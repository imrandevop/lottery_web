import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KeralaLotteryApp from './App';
import AppLinkHandler from './components/AppLinkHandler';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Main app route */}
        <Route path="/" element={<KeralaLotteryApp />} />

        {/* Deep link routes */}
        <Route path="/app/results" element={<AppLinkHandler />} />
        <Route path="/app/*" element={<AppLinkHandler />} />

        {/* Fallback for any unmatched routes */}
        <Route path="*" element={<KeralaLotteryApp />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;