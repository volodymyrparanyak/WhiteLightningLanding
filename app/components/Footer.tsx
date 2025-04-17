'use client';

import { Container, Typography, Box, Link, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import BookIcon from '@mui/icons-material/Book';
import Image from 'next/image';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      }}
      className="bg-pattern"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 3,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, mb: { xs: 2, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <div style={{ width: 32, height: 32, position: 'relative', marginRight: '8px' }}>
                <Image
                  src="/logo.svg"
                  alt="WhiteLightning.ai Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <Typography variant="h6" sx={{ fontFamily: 'var(--font-nunito)', fontWeight: 700 }} className="gradient-text">
                WhiteLightning.ai
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '300px', textAlign: { xs: 'center', md: 'left' } }}>
              Streamlined binary classification tools for machine learning practitioners and developers.
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 4, sm: 6 },
              alignItems: { xs: 'center', sm: 'flex-start' },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Resources
              </Typography>
              <Link href="/docs" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                <BookIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Documentation
              </Link>
              <Link href="/playground" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                <CodeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Playground
              </Link>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                Connect
              </Typography>
              <Link 
                href="https://github.com/yourusername/binary-classifier"
                target="_blank"
                rel="noopener noreferrer"
                color="text.secondary"
                sx={{ mb: 1, display: 'flex', alignItems: 'center', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
              >
                <GitHubIcon sx={{ fontSize: 16, mr: 0.5 }} />
                GitHub
              </Link>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2, opacity: 0.4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} WhiteLightning.ai. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
