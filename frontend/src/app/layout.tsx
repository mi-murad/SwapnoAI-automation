import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Phoenix Framework | AI Marketing Workspace',
  description: 'AI-powered marketing workspace for managing businesses and campaigns.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
