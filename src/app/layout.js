import Navbar from '@/components/Navbar';
import './home.css'; // ou ton CSS global si nécessaire

export const metadata = {
  title: 'Netflix Project',
  description: 'Application de films et séries',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Navbar /> {/* ✅ Navbar affichée sur toutes les pages */}
        <main>{children}</main>
      </body>
    </html>
  );
}
