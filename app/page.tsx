'use client';

import { Container, Typography, Grid, Button, Box, useTheme, useMediaQuery, Paper, Card, CardContent, CardActions } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import BookIcon from '@mui/icons-material/Book';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import CloudIcon from '@mui/icons-material/Cloud';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box className="bg-pattern">
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #f0f4f8 0%, #d5e3f3 100%)',
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%233b82f6\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h1" 
                  className="gradient-text"
                  sx={{ 
                    fontFamily: 'var(--font-nunito)', 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    mb: 2
                  }}
                >
                  WhiteLightning.ai
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 4,
                    fontFamily: 'var(--font-inter)',
                    maxWidth: '600px',
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  Distill the power of advanced AI into compact, portable binary classifiers. Fast, lightweight, and ready to run anywhere.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button 
                    component={Link}
                    href="/docs"
                    variant="contained" 
                    size="large"
                    color="primary"
                    startIcon={<BookIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      py: 1.5,
                      px: 3,
                      fontFamily: 'var(--font-poppins)',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(59, 130, 246, 0.3)'
                      }
                    }}
                  >
                    Documentation
                  </Button>
                  <Button 
                    component={Link}
                    href="/playground"
                    variant="outlined" 
                    size="large"
                    color="primary"
                    startIcon={<PlayCircleOutlineIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      py: 1.5,
                      px: 3,
                      fontFamily: 'var(--font-poppins)',
                      fontWeight: 600,
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderWidth: 2,
                        boxShadow: '0 4px 8px rgba(59, 130, 246, 0.2)'
                      }
                    }}
                  >
                    Try Playground
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', height: '400px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ 
                  width: '350px', 
                  height: '350px', 
                  position: 'relative',
                  filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.15))'
                }}>
                  <Image
                    src="/logo.svg"
                    alt="WhiteLightning.ai Logo"
                    fill
                    priority
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h2" 
          align="center" 
          sx={{ 
            mb: 2,
            fontFamily: 'var(--font-nunito)',
            fontWeight: 700
          }}
        >
          Features
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary" 
          sx={{ 
            mb: 8,
            maxWidth: '700px',
            mx: 'auto',
            fontFamily: 'var(--font-inter)'
          }}
        >
          Our lightweight classifiers are designed to bring AI capabilities to any environment with minimal resource requirements
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <StorageIcon fontSize="large" color="primary" />,
              title: "Optimized Models",
              description: "Compact binary classifiers with minimal storage footprint and excellent performance"
            },
            {
              icon: <SpeedIcon fontSize="large" color="primary" />,
              title: "Lightning Fast",
              description: "Rapid inference times even on resource-constrained devices and environments"
            },
            {
              icon: <DevicesIcon fontSize="large" color="primary" />,
              title: "Cross-Platform",
              description: "Run models on any platform with ONNX runtime support, from browsers to edge devices"
            },
            {
              icon: <CloudIcon fontSize="large" color="primary" />,
              title: "Easy Integration",
              description: "Simple API for integrating with existing applications and workflows"
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="feature-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontFamily: 'var(--font-nunito)', fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'var(--font-inter)' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{ 
              fontFamily: 'var(--font-nunito)',
              fontWeight: 700
            }}
          >
            Ready to Start?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              maxWidth: '700px',
              mx: 'auto',
              fontFamily: 'var(--font-inter)'
            }}
          >
            Jump into our documentation to learn how to implement lightweight binary classifiers in your projects, or try out our models in the interactive playground.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Button 
              component={Link}
              href="/docs"
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white',
                color: '#3b82f6',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                },
                borderRadius: '8px',
                py: 1.5,
                px: 3,
                fontFamily: 'var(--font-poppins)',
                transition: 'all 0.3s ease',
              }}
            >
              Read Docs
            </Button>
            <Button 
              component={Link}
              href="/playground"
              variant="outlined" 
              size="large"
              sx={{ 
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  borderWidth: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                },
                borderRadius: '8px',
                py: 1.5,
                px: 3,
                fontFamily: 'var(--font-poppins)',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
            >
              Try Playground
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}