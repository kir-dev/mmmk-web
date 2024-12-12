import { Header } from '@/components/header';
import { MainContent } from '@/components/main-content';
import { Player } from '@/components/player';
import { RightSidebar } from '@/components/right-sidebar';
import { Sidebar } from '@/components/sidebar';

export default function Home() {
  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='flex-1 flex overflow-hidden'>
        <Sidebar />
        <MainContent />
        <RightSidebar />
      </div>
      <Player />
    </div>
  );
}
