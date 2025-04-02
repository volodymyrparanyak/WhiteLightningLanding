'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import CodeSnippet from './CodeSnippet';
import { CODE_SNIPPETS } from '../../lib/codeSnippets';

interface MarkdownRendererProps {
  content: string;
  codeSnippetKey?: string;
}

export default function MarkdownRenderer({ content, codeSnippetKey }: MarkdownRendererProps) {
  const theme = useTheme();
  const [parsedContent, setParsedContent] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const parseMarkdown = (markdown: string) => {
      // Split the markdown content by line
      const lines = markdown.split('\n');
      const result: React.ReactNode[] = [];
      let currentIndex = 0;

      while (currentIndex < lines.length) {
        const line = lines[currentIndex];

        // Handle headers (h1, h2, h3) with anchor IDs
        if (line.startsWith('# ')) {
          const text = line.substring(2);
          const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          result.push(
            <Typography 
              key={currentIndex} 
              variant="h4" 
              component="h1" 
              id={id}
              sx={{ 
                mt: 2, 
                mb: 2, 
                fontWeight: 'bold',
                scrollMarginTop: "80px" // Add scroll margin for anchor navigation
              }}
            >
              {text}
            </Typography>
          );
        } else if (line.startsWith('## ')) {
          const text = line.substring(3);
          const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          result.push(
            <Typography 
              key={currentIndex} 
              variant="h5" 
              component="h2" 
              id={id}
              sx={{ 
                mt: 3, 
                mb: 2, 
                fontWeight: 'medium',
                scrollMarginTop: "80px" // Add scroll margin for anchor navigation
              }}
            >
              {text}
            </Typography>
          );
        } else if (line.startsWith('### ')) {
          const text = line.substring(4);
          const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          result.push(
            <Typography 
              key={currentIndex} 
              variant="h6" 
              component="h3" 
              id={id}
              sx={{ 
                mt: 2, 
                mb: 1,
                scrollMarginTop: "80px" // Add scroll margin for anchor navigation
              }}
            >
              {text}
            </Typography>
          );
        } 
        // Handle code blocks
        else if (line.startsWith('```')) {
          const language = line.substring(3).trim();
          const codeLines = [];
          currentIndex++;

          while (currentIndex < lines.length && !lines[currentIndex].startsWith('```')) {
            codeLines.push(lines[currentIndex]);
            currentIndex++;
          }

          // Process code blocks for special display
          const code = codeLines.join('\n');
          
          // Handle standard code blocks
          result.push(
            <Box key={currentIndex} component="pre" sx={{ 
              mt: 2, 
              mb: 2, 
              p: 2, 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              borderRadius: 1,
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: theme.palette.grey[300],
             }}>
              <code>{code}</code>
            </Box>
          );
        }
        // Handle lists
        else if (line.startsWith('- ')) {
          const items = [];
          while (currentIndex < lines.length && lines[currentIndex].startsWith('- ')) {
            items.push(
              <Box key={`list-item-${currentIndex}`} component="li" sx={{ mb: 1 }}>
                {renderInlineMarkdown(lines[currentIndex].substring(2))}
              </Box>
            );
            currentIndex++;
          }
          result.push(
            <Box key={`list-${currentIndex}`} component="ul" sx={{ pl: 4, mb: 2 }}>
              {items}
            </Box>
          );
          continue; // Skip the increment at the end of the loop
        }
        // Handle paragraphs (non-empty lines)
        else if (line.trim() !== '') {
          result.push(
            <Typography key={currentIndex} variant="body1" paragraph sx={{ mb: 2 }}>
              {renderInlineMarkdown(line)}
            </Typography>
          );
        }
        // Handle dividers
        else if (line.trim() === '' && currentIndex + 1 < lines.length && lines[currentIndex + 1].trim() === '') {
          result.push(<Divider key={`divider-${currentIndex}`} sx={{ my: 2 }} />);
        }

        currentIndex++;
      }

      // Add code snippet tabs after parsing if a key is provided
      if (codeSnippetKey && CODE_SNIPPETS[codeSnippetKey]) {
        result.push(
          <CodeSnippet 
            key="code-snippet" 
            snippets={CODE_SNIPPETS[codeSnippetKey]} 
            title={codeSnippetKey === 'modelRunning' ? 'Running Models' : undefined}
          />
        );
      }

      return result;
    };

    setParsedContent(parseMarkdown(content));
  }, [content, codeSnippetKey, theme.palette.grey]);

  // Helper function to handle inline formatting
  const renderInlineMarkdown = (text: string) => {
    // Handle bold text
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italics
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Parse the HTML
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <Box sx={{ py: 2 }}>
      {parsedContent}
    </Box>
  );
}