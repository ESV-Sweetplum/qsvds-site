import NavBar from '@/components/NavBar';
import { CookiesProvider } from 'next-client-cookies/server';

export const metadata = {
  title: 'QuaverSV',
  description: 'I have literally no idea what I\'m doing, send help.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <CookiesProvider>
          <NavBar />
          {children}
        </CookiesProvider>
      </body>
    </html>
  );
}
