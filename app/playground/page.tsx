'use client';

import React, {useState, useRef, useEffect} from 'react';
import * as ort from 'onnxruntime-web';
import {
    Container, Box, Typography, Select, MenuItem, Button, TextField, Paper,
    FormControl, InputLabel, useTheme, useMediaQuery, Tooltip, CircularProgress, Chip
} from '@mui/material';
import {
    UploadFile,
    MemoryOutlined,
    CategoryOutlined,
    SchemaOutlined,
    SendRounded,
    ExploreRounded
} from '@mui/icons-material';

interface ChatMessage {
    text: string;
    isUser: boolean;
}

interface PreprocessingData {
    vocabulary: { [word: string]: number };
    idf: number[] | null;
    mean: number[];
    scale: number[];
    max_features: number;
}

interface IModel {
    name: string
    path: string
    vocab: string
    scaler: string
}

const AVAILABLE_MODELS: IModel[] = [
    {
        name: 'Spam Classifier',
        path: 'models/spam_classifier/spam_classifier.onnx',
        vocab: 'models/spam_classifier/spam_classifier_vocab.json',
        scaler: 'models/spam_classifier/spam_classifier_scaler.json'
    },
    {
        name: 'Leading Questions',
        path: 'models/leading_questions/leading_questions.onnx',
        vocab: 'models/leading_questions/leading_questions_vocab.json',
        scaler: 'models/leading_questions/leading_questions_scaler.json'
    },
    {
        name: 'Clickbait News Titles',
        path: 'models/clickbait_news/clickbait_news.onnx',
        vocab: 'models/clickbait_news/clickbait_news_vocab.json',
        scaler: 'models/clickbait_news/clickbait_news_scaler.json'
    },
]

export default function ChatPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
    const [session, setSession] = useState<ort.InferenceSession | null>(null);
    const [preprocessingData, setPreprocessingData] = useState<PreprocessingData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleSelectModel = (name: string) => {
        const model = AVAILABLE_MODELS.find(m => m.name === name);
        setSelectedModel(model!);
    }

    // Load model and preprocessing data
    useEffect(() => {
        const loadResources = async () => {
            if (selectedModel) {
                setIsLoading(true);
                try {
                    setMessages(prev => [...prev, {
                        text: `Loading model: ${selectedModel.name}...`,
                        isUser: false
                    }]);

                    const inferenceSession = await ort.InferenceSession.create(selectedModel.path);
                    setSession(inferenceSession);

                    setMessages(prev => [...prev, {
                        text: `Model loaded successfully! You can now start classifying text.`,
                        isUser: false
                    }]);
                } catch (error) {
                    console.error('Error loading resources:', error);
                    setMessages(prev => [...prev, {
                        text: `Error: ${(error as Error).message}`,
                        isUser: false
                    }]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadResources();
    }, [selectedModel, preprocessingData]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const processInput = async (text: string): Promise<void> => {
        if (!session) {
            setMessages(prev => [...prev, {text: 'Please select a model first', isUser: false}]);
            return;
        }

        setIsProcessing(true);
        try {
            // Show processing message
            setMessages(prev => [...prev, {
                text: 'Processing input, please wait...',
                isUser: false
            }]);


            const vector = await preprocessText(text);
            const tensor = new ort.Tensor("float32", vector, [1, 5000]);
            const feeds = {float_input: tensor};
            const results = await session.run(feeds);

            console.log('Raw results:', results);

            const probability = results['output'].data[0] as number;
            const prediction = probability > 0.5 ? 1 : 0;
            const label = prediction === 1 ? 'Positive' : 'Negative';

            // Remove processing message and add result
            setMessages(prev => {
                const newMessages = [...prev];
                // Remove the processing message
                newMessages.pop();
                // Add the result message
                newMessages.push({
                    text: `Classification: ${label} (Score: ${probability})`,
                    isUser: false
                });
                return newMessages;
            });
        } catch (error) {
            // Remove processing message and add error
            setMessages(prev => {
                const newMessages = [...prev];
                // Remove the processing message if it exists
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].text === 'Processing input, please wait...') {
                    newMessages.pop();
                }
                // Add error message
                newMessages.push({
                    text: `Error processing input: ${(error as Error).message}`,
                    isUser: false
                });
                return newMessages;
            });
        } finally {
            setIsProcessing(false);
        }
    };

    async function preprocessText(text: string) {
        if(!selectedModel) {
            return []
        }
        const tfidfResp = await fetch(selectedModel?.vocab);
        const tfidfData = await tfidfResp.json();
        const vocab = tfidfData.vocab;
        const idf = tfidfData.idf;

        const scalerResp = await fetch(selectedModel?.scaler);
        const scalerData = await scalerResp.json();
        const mean = scalerData.mean;
        const scale = scalerData.scale;

        // TF-IDF
        const vector = new Float32Array(5000).fill(0);
        const words = text.toLowerCase().split(/\s+/);
        const wordCounts = Object.create(null);
        words.forEach(word => wordCounts[word] = (wordCounts[word] || 0) + 1);
        for (const word in wordCounts) {
            if (vocab[word] !== undefined) {
                vector[vocab[word]] = wordCounts[word] * idf[vocab[word]];
            }
        }

        // Scale
        for (let i = 0; i < 5000; i++) {
            vector[i] = (vector[i] - mean[i]) / scale[i];
        }
        return vector;
    }

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setMessages(prev => [...prev, {text: inputText, isUser: true}]);
        void processInput(inputText);
        setInputText('');
    };

    const handleUpload = () => {
        // Placeholder for upload functionality
        setMessages(prev => [...prev, {
            text: "Custom model upload functionality coming soon!",
            isUser: false
        }]);
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: {xs: 2, md: 4},
                px: {xs: 1, md: 3},
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontFamily: 'var(--font-nunito)',
                        fontWeight: 700,
                        textAlign: {xs: 'center', sm: 'left'}
                    }}
                    className="gradient-text"
                >
                    Model Playground
                </Typography>

                {(isLoading || isProcessing) && (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <CircularProgress size={20} color="primary"/>
                        <Typography variant="body2" color="text.secondary">
                            {isLoading ? 'Loading model...' : 'Processing...'}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
                }}
                className="feature-card"
            >
                {/* Control Panel at the top */}
                <Box
                    sx={{
                        p: 2.5,
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isMobile ? 'stretch' : 'center',
                        gap: 2,
                        background: 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
                    }}
                >
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                        <Tooltip title="Select a binary classifier model" arrow placement="top">
                            <FormControl size="small" sx={{width: isMobile ? '100%' : '250px'}}>
                                <InputLabel id="model-select-label">
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <CategoryOutlined fontSize="small"/>
                                        Select Model
                                    </Box>
                                </InputLabel>
                                <Select
                                    labelId="model-select-label"
                                    value={selectedModel?.name}
                                    label={
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                            <CategoryOutlined fontSize="small"/>
                                            Select Model
                                        </Box>
                                    }
                                    onChange={(e) => handleSelectModel(e.target.value as string)}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                                        borderRadius: '8px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(59, 130, 246, 0.2)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(59, 130, 246, 0.4)',
                                        },
                                    }}
                                    disabled={isLoading}
                                >
                                    <MenuItem value="">
                                        <em>Choose a model</em>
                                    </MenuItem>
                                    {AVAILABLE_MODELS.map((model) => (
                                        <MenuItem key={model.name} value={model.name}>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <SchemaOutlined fontSize="small" color="primary"/>
                                                {model.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>

                        {session && (
                            <Chip
                                icon={<MemoryOutlined fontSize="small"/>}
                                label="Model loaded"
                                color="success"
                                size="small"
                                sx={{fontFamily: 'var(--font-inter)'}}
                            />
                        )}
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<UploadFile/>}
                        onClick={handleUpload}
                        sx={{
                            height: isMobile ? 'auto' : '40px',
                            whiteSpace: 'nowrap',
                            borderRadius: '8px',
                            borderWidth: '1.5px',
                            fontFamily: 'var(--font-poppins)',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderWidth: '1.5px',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.2)'
                            }
                        }}
                        disabled={isLoading}
                    >
                        Upload Custom
                    </Button>
                </Box>

                {/* Chat Container */}
                <Box
                    ref={chatContainerRef}
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%233b82f6\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
                        backgroundAttachment: 'fixed',
                    }}
                >
                    {messages.length === 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                gap: 2,
                            }}
                        >
                            <ExploreRounded sx={{fontSize: 40, color: 'primary.main', opacity: 0.7}}/>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                align="center"
                                sx={{fontFamily: 'var(--font-nunito)', fontWeight: 600}}
                            >
                                Welcome to the Playground
                            </Typography>
                            <Typography variant="body1" color="text.secondary" align="center" sx={{maxWidth: '400px'}}>
                                Select a model above and start classifying text. Enter your message in the box below to
                                see how the model classifies it.
                            </Typography>
                        </Box>
                    )}

                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            sx={{
                                alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                                maxWidth: {xs: '90%', sm: '75%'},
                                mb: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: message.isUser ? 'row-reverse' : 'row',
                                    alignItems: 'flex-end',
                                    mb: 0.5,
                                    gap: 1,
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2.5,
                                        bgcolor: message.isUser
                                            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                            : 'background.paper',
                                        backgroundImage: message.isUser
                                            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                            : 'none',
                                        color: message.isUser ? '#fff' : 'text.primary',
                                        wordBreak: 'break-word',
                                        boxShadow: message.isUser
                                            ? '0 2px 5px rgba(37, 99, 235, 0.2)'
                                            : '0 2px 5px rgba(0, 0, 0, 0.05)',
                                        position: 'relative',
                                        '&::before': message.isUser ? {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 8,
                                            right: -6,
                                            width: 12,
                                            height: 12,
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            transform: 'rotate(45deg)',
                                            borderRadius: 1,
                                            zIndex: -1,
                                        } : {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 8,
                                            left: -6,
                                            width: 12,
                                            height: 12,
                                            backgroundColor: 'background.paper',
                                            transform: 'rotate(45deg)',
                                            borderRadius: 1,
                                            zIndex: -1,
                                        }
                                    }}
                                >
                                    <Typography variant="body1" sx={{fontFamily: 'var(--font-inter)'}}>
                                        {message.text}
                                    </Typography>
                                </Paper>
                            </Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                                    px: 1,
                                    opacity: 0.7,
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: '0.7rem'
                                }}
                            >
                                {message.isUser ? 'You' : 'AI Assistant'}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        p: 2.5,
                        borderTop: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        gap: 1.5,
                        background: 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
                    }}
                >
                    <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        placeholder={session ? "Enter text to classify..." : "Please select a model first"}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={!session || isLoading || isProcessing}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                fontFamily: 'var(--font-inter)',
                                '& fieldset': {
                                    borderColor: 'rgba(59, 130, 246, 0.2)',
                                    borderWidth: '1px',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(59, 130, 246, 0.4)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(59, 130, 246, 0.6)',
                                    borderWidth: '2px',
                                }
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!session || isLoading || isProcessing || !inputText.trim()}
                        disableElevation
                        endIcon={isProcessing ? <CircularProgress size={16} color="inherit"/> : <SendRounded/>}
                        sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: '8px',
                            fontFamily: 'var(--font-poppins)',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s ease',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }
                        }}
                    >
                        {isProcessing ? 'Processing...' : 'Classify'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}