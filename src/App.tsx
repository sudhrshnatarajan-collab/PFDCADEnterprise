import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PFDWorkspace from '@/pages/PFDWorkspace';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
      <div className="text-center">
        <div className="text-4xl font-bold text-[#E5E7EB] mb-2">404</div>
        <p className="text-[#6B7280] text-sm">Page not found</p>
        <a href="/" className="mt-4 inline-block text-[#2563EB] text-sm hover:underline">← Back to PFD Workspace</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PFDWorkspace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
