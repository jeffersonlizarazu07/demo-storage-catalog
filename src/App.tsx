import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ThemeProvider } from './shared/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
