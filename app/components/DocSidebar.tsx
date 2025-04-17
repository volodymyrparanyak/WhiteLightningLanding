'use client';

import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Box, ListItemIcon, useTheme, alpha } from '@mui/material';
import { DocumentTextIcon, CodeBracketIcon, LightBulbIcon, CogIcon } from '@heroicons/react/24/outline';

interface DocSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  contentMap?: {[key: string]: string};
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface SectionHeader {
  id: string;
  text: string;
  level: number;
}

export default function DocSidebar({ activeSection, onSectionChange, contentMap }: DocSidebarProps) {
  const theme = useTheme();
  const [sectionHeaders, setSectionHeaders] = useState<{[key: string]: SectionHeader[]}>({});
  
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
  ];
  
  useEffect(() => {
    if (!contentMap) return;
    
    const extractedHeaders: {[key: string]: SectionHeader[]} = {};
    
    Object.entries(contentMap).forEach(([section, content]) => {
      const headers: SectionHeader[] = [];
      const lines = content.split('\n');
      
      lines.forEach(line => {
        if (line.startsWith('# ')) {
          const text = line.substring(2);
          const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          headers.push({ id, text, level: 1 });
        } else if (line.startsWith('## ')) {
          const text = line.substring(3);
          const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          headers.push({ id, text, level: 2 });
        } else if (line.startsWith('### ')) {
          const text = line.substring(4);
          const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          headers.push({ id, text, level: 3 });
        }
      });
      
      extractedHeaders[section] = headers;
    });
    
    setSectionHeaders(extractedHeaders);
  }, [contentMap]);

  // Function to scroll to an element by ID
  const scrollToHeader = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          color: '#ffffff'
        }}
      >
        Documentation
      </Typography>
      
      <List sx={{ px: 1 }}>
        {sections.map((section) => (
          <React.Fragment key={section.id}>
            <ListItem 
              onClick={() => onSectionChange(section.id)}
              sx={{ 
                borderRadius: '8px', 
                mb: 0.5,
                cursor: 'pointer',
                backgroundColor: activeSection === section.id 
                  ? alpha(theme.palette.primary.main, 0.1) 
                  : 'transparent',
                color: theme.palette.primary.main,
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
            
            {/* Render subsections when this section is active */}
            {activeSection === section.id && sectionHeaders[section.id] && (
              <Box sx={{ ml: 4, mb: 1 }}>
                {sectionHeaders[section.id].map((header) => (
                  <ListItem 
                    key={header.id}
                    onClick={() => scrollToHeader(header.id)}
                    sx={{ 
                      py: 0.5,
                      borderRadius: '8px', 
                      mb: 0.3,
                      cursor: 'pointer',
                      pl: header.level === 1 ? 1 : (header.level === 2 ? 2 : 3),
                      fontSize: header.level === 1 ? '0.875rem' : '0.8rem',
                      fontWeight: header.level === 1 ? 'medium' : 'normal',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.1),
                        color: '#ffffff',
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ 
                      fontSize: 'inherit',
                      fontWeight: 'inherit'
                    }}>
                      {header.text}
                    </Typography>
                  </ListItem>
                ))}
              </Box>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}