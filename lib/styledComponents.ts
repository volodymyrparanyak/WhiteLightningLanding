import { styled } from '@mui/system';
import {Box} from "@mui/material";

export const Sidebar = styled(Box)(({ theme }) => ({
  width: '250px',
  position: 'sticky',
  top: '20px',
  height: 'calc(100vh - 40px)',
  overflowY: 'auto',
  borderRadius: '12px',
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    position: 'relative',
    height: 'auto',
    marginBottom: theme.spacing(4),
  },
}));

export const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
}));