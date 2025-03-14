'use client';

import { Container, Typography, Box, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">
              Binary Classifier
            </Link>{' '}
            {new Date().getFullYear()}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 3 },
              alignItems: 'center',
            }}
          >
            <Link
              href="https://scikit-learn.org/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              variant="body2"
            >
              Powered by scikit-learn
            </Link>
            <Link
              href="https://github.com/yourusername/binary-classifier"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              variant="body2"
            >
              Source Code
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
