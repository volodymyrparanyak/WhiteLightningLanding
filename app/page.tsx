'use client';

import { Container, Typography, Grid, Paper, Box, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `radial-gradient(circle, ${theme.palette.grey[800]} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))',
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant={isMobile ? 'h3' : 'h2'}
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
            textAlign: { xs: 'center', sm: 'left' },
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ffffff, #b0bec5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          WhiteLightning.ai
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 4, sm: 6 },
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            textAlign: { xs: 'center', sm: 'left' },
            color: theme.palette.text.secondary,
            maxWidth: '600px',
          }}
        >
          Distill the power of advanced AI into compact, portable models. Fast, lightweight, and ready to run anywhere.
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
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 16px ${theme.palette.grey[900]}`,
                },
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 'medium',
                  color: theme.palette.grey[100],
                }}
              >
                📜 Docs
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  color: theme.palette.text.secondary,
                }}
              >
                Explore the CLI guide and API for crafting distilled models.
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
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 16px ${theme.palette.grey[900]}`,
                },
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 'medium',
                  color: theme.palette.grey[100],
                }}
              >
                ⚡ Playground
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  color: theme.palette.text.secondary,
                }}
              >
                Test the distilled magic of WhiteLightning.ai in action.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}