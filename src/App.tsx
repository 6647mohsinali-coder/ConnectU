/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ConfessionsView } from './components/ConfessionsView';
import { ChatView } from './components/ChatView';
import { MarketplaceView } from './components/MarketplaceView';
import { GigsView } from './components/GigsView';
import { NewItemModal } from './components/NewItemModal';
import { ProfileDrawer } from './components/ProfileDrawer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Strict 3-zone Top Bar Contract Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeTab === 'confessions' && <ConfessionsView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'marketplace' && <MarketplaceView />}
        {activeTab === 'gigs' && <GigsView />}
      </main>

      {/* Creation Modal for Confessions, Products & Gigs */}
      <NewItemModal />

      {/* Student Profile & Campus Switcher Drawer */}
      <ProfileDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
