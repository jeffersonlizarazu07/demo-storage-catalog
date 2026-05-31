import { Outlet } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function MainLayout() {
  const { isDark, toggle } = useDarkMode();

  return (
    <>
      <Navbar isDark={isDark} onToggleDark={toggle} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
