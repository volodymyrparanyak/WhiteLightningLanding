'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Binary Classifier Library
      </Typography>
      <Typography variant="h5" sx={{ mb: 6 }}>
        Welcome to the documentation and playground for the Binary Classifier library.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            component={Link}
            href="/docs"
            sx={{
              p: 4,
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
            <Typography variant="h4" gutterBottom>
              📚 Documentation
            </Typography>
            <Typography color="text.secondary">
              Comprehensive guide and API reference
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            component={Link}
            href="/playground"
            sx={{
              p: 4,
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
            <Typography variant="h4" gutterBottom>
              🎮 Playground
            </Typography>
            <Typography color="text.secondary">
              Interactive model testing environment
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}