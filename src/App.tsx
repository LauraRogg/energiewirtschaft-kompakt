import { lazy, Suspense, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TopicView from './components/TopicView';
import CompareView from './components/CompareView';
import Settings from './components/Settings';
import { useStore } from './store/useStore';

const BigPicture = lazy(() => import('./components/BigPicture'));
const AssistantView = lazy(() => import('./components/AssistantView'));

export default function App() {
  const store = useStore();
  const [showSettings, setShowSettings] = useState(false);

  if (store.loading) {
    return (
      <div className="min-h-svh flex items-center justify-center text-slate-500 gap-3">
        <div className="w-8 h-8 border-2 border-[#0b2540] border-t-transparent rounded-full animate-spin" />
        Lade Wissenslandkarte …
      </div>
    );
  }

  return (
    <>
      {showSettings && <Settings onClose={() => setShowSettings(false)} onReset={store.resetToBasis} />}
      <Layout view={store.view} setView={store.setView} saveStatus={store.saveStatus} saveError={store.saveError} onOpenSettings={() => setShowSettings(true)}>
        <Suspense fallback={<div className="p-10 text-slate-400">Lade …</div>}>
          {store.view === 'dashboard' && <Dashboard store={store} />}
          {store.view === 'bigpicture' && <BigPicture store={store} />}
          {store.view === 'thema' && <TopicView store={store} />}
          {store.view === 'vergleich' && <CompareView store={store} />}
          {store.view === 'assistent' && <AssistantView store={store} onOpenSettings={() => setShowSettings(true)} />}
        </Suspense>
      </Layout>
    </>
  );
}
