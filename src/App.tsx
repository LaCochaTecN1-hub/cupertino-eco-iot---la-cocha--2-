/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CupertinoHeader } from './components/CupertinoHeader';
import { CupertinoTabBar } from './components/CupertinoTabBar';
import { Screen1Intro } from './components/screens/Screen1Intro';
import { Screen2Dashboard } from './components/screens/Screen2Dashboard';
import { Screen3ChartsMap } from './components/screens/Screen3ChartsMap';
import { Screen4GeminiAlert } from './components/screens/Screen4GeminiAlert';
import { Screen5DataTable } from './components/screens/Screen5DataTable';
import { Screen6Guestbook } from './components/screens/Screen6Guestbook';
import { Screen7Admin } from './components/screens/Screen7Admin';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const getScreenConfig = () => {
    switch (activeTab) {
      case 1:
        return { title: 'Estación Eco-IoT', subtitle: 'La Cocha • Tucumán', showBack: false };
      case 2:
        return { title: 'Telemetría en Vivo', subtitle: 'La Cocha, Tucumán', showBack: false };
      case 3:
        return { title: 'Gráficos', subtitle: 'ThingSpeak Oficial', showBack: true };
      case 4:
        return { title: 'Alerta Temprana IA', subtitle: 'Gemini 3.8 • Zafra y Tormentas', showBack: true };
      case 5:
        return { title: 'Historial de Feeds', subtitle: 'DataTable Completo', showBack: true };
      case 6:
        return { title: 'Comunidad', subtitle: 'E.T. N° 1 La Cocha', showBack: false };
      case 7:
        return { title: 'Administración', subtitle: 'Panel Técnico', showBack: false };
      default:
        return { title: 'Cupertino Eco-IoT', subtitle: 'La Cocha, Tucumán', showBack: false };
    }
  };

  const { title, subtitle, showBack } = getScreenConfig();

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] flex justify-center selection:bg-[#74ACDF]/30">
      {/* Mobile Shell with iPhone portrait HIG proportions */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative shadow-2xl bg-[#F2F4F7] dark:bg-[#0F172A]">
        {/* Cupertino iOS Header */}
        <CupertinoHeader
          title={title}
          subtitle={subtitle}
          showBack={showBack}
          onBack={() => setActiveTab(2)}
        />

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 px-4 pt-3.5 pb-20 overflow-y-auto">
          {activeTab === 1 && <Screen1Intro />}
          {activeTab === 2 && <Screen2Dashboard />}
          {activeTab === 3 && <Screen3ChartsMap />}
          {activeTab === 4 && <Screen4GeminiAlert />}
          {activeTab === 5 && <Screen5DataTable />}
          {activeTab === 6 && <Screen6Guestbook />}
          {activeTab === 7 && <Screen7Admin />}
        </main>

        {/* Cupertino iOS Tab Bar */}
        <CupertinoTabBar />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
