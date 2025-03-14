'use client';

import { AppBar, Toolbar, Typography, Button, Container, IconButton, Menu, MenuItem, Box } from '@mui/material';
import Link from 'next/link';
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
            <GitHubIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Binary Classifier
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <Button
              component={Link}
              href="/docs"
              color={pathname?.startsWith('/docs') ? 'primary' : 'inherit'}
              sx={{ ml: 2 }}
            >
              Documentation
            </Button>
            <Button
              component={Link}
              href="/playground"
              color={pathname?.startsWith('/playground') ? 'primary' : 'inherit'}
              sx={{ ml: 2 }}
            >
              Playground
            </Button>
            <IconButton
              component="a"
              href="https://github.com/yourusername/binary-classifier"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ ml: 2 }}
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