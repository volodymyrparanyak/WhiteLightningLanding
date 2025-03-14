'use client';

import { AppBar, Toolbar, Typography, Button, Container, IconButton, Menu, MenuItem, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

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
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1,
            }}
          >
            Binary Classifier
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
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
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}