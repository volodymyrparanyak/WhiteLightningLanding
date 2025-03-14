'use client';

import { Container, Typography, Grid, Paper, Box, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
      <Typography 
        variant={isMobile ? "h3" : "h2"} 
        component="h1" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Binary Classifier Library
      </Typography>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: { xs: 4, sm: 6 },
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Welcome to the documentation and playground for the Binary Classifier library.
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} sm={6}>
          <Paper
            component={Link}
            href="/docs"
            sx={{
              p: { xs: 3, sm: 4 },
              height: '100%',
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: 3,
              },
            }}
          >
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              📚 Documentation
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Comprehensive guide and API reference
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            component={Link}
            href="/playground"
            sx={{
              p: { xs: 3, sm: 4 },
              height: '100%',
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: 3,
              },
            }}
          >
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              🎮 Playground
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Interactive model testing environment
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}