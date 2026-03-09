import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life Boss Fight',
  description: 'Turn chaos into calm, guided missions.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-water">{children}</body>
    </html>
  );
}
