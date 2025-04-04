'use client';

import {useState, useEffect} from 'react';
import {
    Container,
    Box,
    Grid,
    Paper,
    useTheme,
    useMediaQuery,
    Drawer,
    IconButton,
    Fab,
} from '@mui/material';
import DocSidebar from '../components/DocSidebar';
import MarkdownRenderer from '../components/MarkdownRenderer';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';

export default function Docs() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeSection, setActiveSection] = useState('introduction');
    const [markdownContent, setMarkdownContent] = useState('');
    const [codeSnippetKey, setCodeSnippetKey] = useState<string | undefined>(undefined);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        if (isMobile) {
            setMobileDrawerOpen(false);
        }
    };

    const toggleMobileDrawer = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    // State to store all markdown content
    const [allContent, setAllContent] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all content at once
    useEffect(() => {
        const fetchAllContent = async () => {
            setIsLoading(true);
            const sections = ['introduction', 'models', 'onnx', 'api'];
            const contentMap: { [key: string]: string } = {};

            try {
                await Promise.all(
                    sections.map(async (section) => {
                        try {
                            const response = await fetch(`/docs/${section}.md`);
                            if (response.ok) {
                                const content = await response.text();
                                contentMap[section] = content;
                            } else {
                                contentMap[section] = `# Content Not Found\n\nThe ${section} documentation section could not be found.`;
                            }
                        } catch (error) {
                            console.error(`Error loading ${section} documentation:`, error);
                            contentMap[section] = `# Error\n\nFailed to load ${section} documentation content.`;
                        }
                    })
                );

                setAllContent(contentMap);
            } catch (error) {
                console.error('Error loading documentation:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllContent();
    }, []);

    useEffect(() => {
        if (allContent[activeSection]) {
            setMarkdownContent(allContent[activeSection]);

            if (activeSection === 'api') {
                setCodeSnippetKey('modelRunning');
            } else if (activeSection === 'usage') {
                setCodeSnippetKey('basicUsage');
            } else {
                setCodeSnippetKey(undefined);
            }
        }
    }, [activeSection, allContent]);

    const renderSidebar = () => (
        <DocSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            contentMap={allContent}
        />
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            pb: 8,
        }}>
            <Container maxWidth="lg" sx={{pt: {xs: 2, md: 4}}}>
                {/* Mobile header with menu button */}
                {isMobile && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            mt: 1
                        }}
                    >
                        <IconButton
                            onClick={toggleMobileDrawer}
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <Bars3Icon style={{width: 24, height: 24}}/>
                        </IconButton>
                    </Box>
                )}

                <Grid container spacing={isMobile ? 0 : 3}>
                    {/* Sidebar - hidden on mobile, shown in drawer */}
                    {!isMobile ? (
                        <Grid item md={3} lg={3}>
                            <Box
                                component={Paper}
                                elevation={2}
                                sx={{
                                    borderRadius: 2,
                                    position: 'sticky',
                                    top: 24,
                                    height: 'calc(100vh - 48px)',
                                    overflow: 'auto'
                                }}
                            >
                                {renderSidebar()}
                            </Box>
                        </Grid>
                    ) : (
                        <Drawer
                            anchor="left"
                            open={mobileDrawerOpen}
                            onClose={() => setMobileDrawerOpen(false)}
                            PaperProps={{
                                sx: {
                                    width: '80%',
                                    maxWidth: '300px',
                                    borderTopRightRadius: 8,
                                    borderBottomRightRadius: 8,
                                    p: 1
                                }
                            }}
                        >
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 1}}>
                                <IconButton onClick={() => setMobileDrawerOpen(false)}>
                                    <XMarkIcon style={{width: 24, height: 24}}/>
                                </IconButton>
                            </Box>
                            {renderSidebar()}
                        </Drawer>
                    )}

                    <Grid item xs={12} md={9} lg={9}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: {xs: 2, md: 4},
                                borderRadius: 2,
                                color: '#FFFFFF'
                            }}
                        >
                            <MarkdownRenderer
                                content={markdownContent}
                                codeSnippetKey={codeSnippetKey}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {isMobile && !mobileDrawerOpen && (
                <Fab
                    color="primary"
                    aria-label="menu"
                    sx={{position: 'fixed', bottom: 16, right: 16}}
                    onClick={toggleMobileDrawer}
                >
                    <Bars3Icon style={{width: 24, height: 24}}/>
                </Fab>
            )}
        </Box>
    );
}