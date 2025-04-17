'use client';

import { AppBar, Toolbar, Typography, Button, Container, IconButton, Menu, MenuItem, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Navigation() {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, position: 'relative', marginRight: '12px' }}>
                <Image
                  src="/logo.svg"
                  alt="WhiteLightning.ai Logo"
                  fill
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-nunito)',
                  fontWeight: 700,
                  color: 'inherit',
                  display: { xs: 'none', sm: 'block' }
                }}
                className="gradient-text"
              >
                WhiteLightning.ai
              </Typography>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <Button
              component={Link}
              href="/docs"
              variant={pathname?.startsWith('/docs') ? 'contained' : 'text'}
              color="primary"
              sx={{ 
                ml: 2,
                fontFamily: 'var(--font-poppins)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
                }
              }}
            >
              Documentation
            </Button>
            <Button
              component={Link}
              href="/playground"
              variant={pathname?.startsWith('/playground') ? 'contained' : 'text'}
              color="primary"
              sx={{ 
                ml: 2,
                fontFamily: 'var(--font-poppins)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
                }
              }}
            >
              Playground
            </Button>
            <IconButton
              component="a"
              href="https://github.com/yourusername/binary-classifier"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              sx={{ 
                ml: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px) rotate(5deg)',
                  color: '#8b5cf6'
                }
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem 
                component={Link} 
                href="/docs" 
                onClick={handleClose}
                selected={pathname?.startsWith('/docs')}
              >
                Documentation
              </MenuItem>
              <MenuItem 
                component={Link} 
                href="/playground" 
                onClick={handleClose}
                selected={pathname?.startsWith('/playground')}
              >
                Playground
              </MenuItem>
              <MenuItem 
                component="a"
                href="https://github.com/yourusername/binary-classifier"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
              >
                GitHub Repository
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}