import { Outlet } from 'react-router-dom';
import Navbar from './Blog';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
}
