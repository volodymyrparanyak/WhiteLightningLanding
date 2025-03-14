'use client';

import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

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
        </Toolbar>
      </Container>
    </AppBar>
  )
}