import {ThemeProvider} from '@mui/material/styles';
import theme from '../lib/theme'; // Adjust path based on your structure
import {CssBaseline} from '@mui/material';
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import ThemeWrapper from "@/app/components/ThemeWrapper";
import './globals.css';
import { Inter, Poppins, Nunito } from 'next/font/google'

// Define fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
})

const nunito = Nunito({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito'
});

export const metadata = {
    title: 'WhiteLightning.ai',
    description: 'Distilled AI Playground and Docs',
    icons: {
        icon: '/logo.svg',
    },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable} ${nunito.variable}`}>
        <body className="bg-gradient-to-br from-slate-50 to-blue-50">
        <ThemeWrapper>
            <Navigation/>
            <main className="min-h-screen">
                {children}
            </main>
            <Footer/>
        </ThemeWrapper>
        </body>
        </html>
    );
}