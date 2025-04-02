'use client';

import React from 'react';
import { List, ListItem, ListItemText, Typography, Box, ListItemIcon, useTheme, alpha } from '@mui/material';
import { DocumentTextIcon, CodeBracketIcon, LightBulbIcon, CogIcon } from '@heroicons/react/24/outline';

interface DocSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function DocSidebar({ activeSection, onSectionChange }: DocSidebarProps) {
  const theme = useTheme();
  
  const sections: DocSection[] = [
    { 
      id: 'introduction', 
      title: 'Overview', 
      icon: <DocumentTextIcon style={{ width: 20, height: 20 }} /> 
    },
    { 
      id: 'models', 
      title: 'How Models Work', 
      icon: <LightBulbIcon style={{ width: 20, height: 20 }} /> 
    },
    { 
      id: 'onnx', 
      title: 'ONNX Explained', 
      icon: <CogIcon style={{ width: 20, height: 20 }} /> 
    },
    { 
      id: 'api', 
      title: 'Running ONNX Models', 
      icon: <CodeBracketIcon style={{ width: 20, height: 20 }} /> 
    },
    { 
      id: 'usage', 
      title: 'Usage Guide', 
      icon: <DocumentTextIcon style={{ width: 20, height: 20 }} /> 
    },
  ];

  return (
    <Box sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>
      <Typography 
        variant="h6" 
        component="h2" 
        sx={{ 
          px: 3, 
          pt: 3, 
          pb: 2, 
          fontWeight: 'medium',
          color: theme.palette.text.primary 
        }}
      >
        Documentation
      </Typography>
      
      <List sx={{ px: 1 }}>
        {sections.map((section) => (
          <ListItem 
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            sx={{ 
              borderRadius: '8px', 
              mb: 0.5,
              cursor: 'pointer',
              backgroundColor: activeSection === section.id 
                ? alpha(theme.palette.primary.main, 0.1) 
                : 'transparent',
              color: activeSection === section.id 
                ? theme.palette.primary.main 
                : theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: activeSection === section.id 
                  ? alpha(theme.palette.primary.main, 0.2) 
                  : alpha(theme.palette.action.hover, 0.1),
              }
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 36, 
              color: 'inherit'
            }}>
              {section.icon}
            </ListItemIcon>
            <ListItemText 
              primary={section.title} 
              primaryTypographyProps={{ 
                fontSize: '0.925rem',
                fontWeight: activeSection === section.id ? 'medium' : 'regular'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}