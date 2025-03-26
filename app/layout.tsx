import {ThemeProvider} from '@mui/material/styles';
import theme from '../lib/theme'; // Adjust path based on your structure
import {CssBaseline} from '@mui/material';
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import ThemeWrapper from "@/app/components/ThemeWrapper";

export const metadata = {
    title: 'WhiteLightning.ai',
    description: 'Distilled AI Playground and Docs',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeWrapper>
            <Navigation/>
            {children}
            <Footer/>
        </ThemeWrapper>
        </body>
        </html>
    );
}