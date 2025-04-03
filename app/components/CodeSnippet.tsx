'use client';

import React, {useState} from 'react';
import {Box, Tabs, Tab, Paper, Typography, useTheme, Button} from '@mui/material';
import {ContentCopy} from '@mui/icons-material';
import {CodeSnippet as CodeSnippetType} from '../../lib/codeSnippets';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'; // A popular dark theme


interface CodeSnippetProps {
    snippets: CodeSnippetType[];
    title?: string;
}

export default function CodeSnippet({snippets, title}: CodeSnippetProps) {
    const [value, setValue] = useState(0);
    const [copied, setCopied] = useState(false);
    const theme = useTheme();

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(snippets[value].code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Paper
            elevation={2}
            sx={{
                my: 2,
                bgcolor: 'rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                borderRadius: 2,
            }}
        >
            <Box sx={{
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1
            }}>
                {title && (
                    <Typography variant="body2" sx={{ml: 1, color: theme.palette.grey[400]}}>
                        {title}
                    </Typography>
                )}
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="code snippet tabs"
                    textColor="inherit"
                    indicatorColor="primary"
                    sx={{
                        minHeight: '42px',
                        '.MuiTab-root': {
                            py: 1,
                            minHeight: '42px',
                            color: theme.palette.grey[400],
                            textTransform: 'none',
                            '&.Mui-selected': {
                                color: theme.palette.primary.main,
                            }
                        }
                    }}
                >
                    {snippets.map((snippet, index) => (
                        <Tab
                            key={index}
                            label={snippet.displayName}
                            id={`simple-tab-${index}`}
                            aria-controls={`simple-tabpanel-${index}`}
                        />
                    ))}
                </Tabs>
                <Button
                    startIcon={<ContentCopy/>}
                    size="small"
                    onClick={copyToClipboard}
                    sx={{
                        minWidth: 0,
                        color: copied ? theme.palette.success.main : theme.palette.grey[400],
                        textTransform: 'none',
                        mr: 1,
                    }}
                >
                    {copied ? 'Copied!' : 'Copy'}
                </Button>
            </Box>

            <Box sx={{p: 2, bgcolor: 'rgba(0, 0, 0, 0.3)'}}>
                <SyntaxHighlighter
                    language={snippets[value].language}
                    style={vscDarkPlus}
                    wrapLines={true}
                >
                    {snippets[value].code}
                </SyntaxHighlighter>
            </Box>
        </Paper>
    );
}