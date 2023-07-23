import { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
    title: {
        default: 'Ton Vault',
        template: `%s - Ton Vault`,
    },
    description: 'Secure Vault for encrypted data powered by Ton Storage',
    colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
