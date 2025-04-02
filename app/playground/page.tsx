'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as ort from 'onnxruntime-web';
import { Container, Box, Typography, Select, MenuItem, Button, TextField, Paper, 
  FormControl, InputLabel, useTheme, useMediaQuery } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

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

export default function ChatPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [models] = useState<string[]>(['assets/leading_questions_model.onnx', 'assets/spam_classifier_model.onnx']);
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [preprocessingData, setPreprocessingData] = useState<PreprocessingData | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load model and preprocessing data
  useEffect(() => {
    const loadResources = async () => {
      try {
        if (selectedModel) {
          const inferenceSession = await ort.InferenceSession.create(selectedModel);
          console.log('Input names:', inferenceSession.inputNames);
          console.log('Output names:', inferenceSession.outputNames);
          setSession(inferenceSession);
        }

        const response = await fetch('assets/spam_classifier_preprocessing_data.json');
        const data = await response.json();
        setPreprocessingData(data);
      } catch (error) {
        console.error('Error loading resources:', error);
        setMessages(prev => [...prev, {
          text: `Error: ${(error as Error).message}`,
          isUser: false
        }]);
      }
    };
    loadResources();
  }, [selectedModel]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const preprocessInput = (text: string): Float32Array => {
    if (!preprocessingData) return new Float32Array(5000).fill(0);

    const { vocabulary, idf, mean, scale, max_features } = preprocessingData;
    const tokens = text.toLowerCase().split(/\s+/);
    const tfidf = new Float32Array(max_features).fill(0);

    // Simplified TF-IDF: term frequency only (no document frequency in single query)
    tokens.forEach(token => {
      const idx = vocabulary[token];
      if (idx !== undefined) {
        tfidf[idx] += 1; // Increment term frequency
      }
    });

    // Apply IDF if available (approximation)
    if (idf) {
      for (let i = 0; i < max_features; i++) {
        if (tfidf[i] > 0) {
          tfidf[i] *= idf[i];
        }
      }
    }

    // Standardize using mean and scale
    for (let i = 0; i < max_features; i++) {
      tfidf[i] = (tfidf[i] - mean[i]) / scale[i];
    }

    return tfidf;
  };

  const processInput = async (text: string): Promise<void> => {
    if (!session) {
      setMessages(prev => [...prev, { text: 'Please select a model first', isUser: false }]);
      return;
    }

    try {
      const processedInput = preprocessInput(text);
      const inputTensor = new ort.Tensor('float32', processedInput, [1, 5000]);
      const feeds: { [key: string]: ort.Tensor } = { 'float_input': inputTensor };

      const results = await session.run(feeds);
      console.log('Raw results:', results);

      const probability = results['output'].data[0] as number;
      const prediction = probability > 0.5 ? 1 : 0;
      const label = prediction === 1 ? 'Positive' : 'Negative';

      setMessages(prev => [...prev, {
        text: `Classification: ${label} (Score: ${probability.toFixed(2)})`,
        isUser: false
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: `Error processing input: ${(error as Error).message}`,
        isUser: false
      }]);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, { text: inputText, isUser: true }]);
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
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 }, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ mb: 2, fontWeight: 'medium', textAlign: { xs: 'center', sm: 'left' } }}
      >
        Playground
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          borderRadius: 2, 
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}
      >
        {/* Control Panel at the top */}
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: 2
          }}
        >
          <FormControl size="small" sx={{ width: isMobile ? '100%' : '250px' }}>
            <InputLabel id="model-select-label">Select Model</InputLabel>
            <Select
              labelId="model-select-label"
              value={selectedModel}
              label="Select Model"
              onChange={(e) => setSelectedModel(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <MenuItem value="">
                <em>Choose a model</em>
              </MenuItem>
              {models.map((model) => (
                <MenuItem key={model} value={model}>
                  {model.split('/').pop()?.replace('.onnx', '')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            startIcon={<UploadFile />} 
            onClick={handleUpload}
            sx={{ 
              height: isMobile ? 'auto' : '40px',
              whiteSpace: 'nowrap'
            }}
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
            p: 2,
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column'
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
                opacity: 0.7
              }}
            >
              <Typography variant="body1" color="text.secondary" align="center">
                Select a model and start classifying text
              </Typography>
            </Box>
          )}
          
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: message.isUser ? 'primary.dark' : 'background.paper',
                  color: message.isUser ? 'primary.contrastText' : 'text.primary',
                  wordBreak: 'break-word'
                }}
              >
                <Typography variant="body1">
                  {message.text}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
        
        {/* Input Form */}
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex',
            gap: 1
          }}
        >
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Enter text to classify..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disableElevation
            sx={{ 
              px: 3,
              whiteSpace: 'nowrap'
            }}
          >
            Classify
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}