import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
