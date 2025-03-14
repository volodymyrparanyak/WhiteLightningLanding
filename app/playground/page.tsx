'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Select, 
  MenuItem, 
  Button, 
  TextField,
  Paper,
  Stack,
  FormControl,
  InputLabel
} from '@mui/material';
import { useState } from 'react';

const availableModels = [
  "Logistic Regression",
  "Random Forest",
  "Neural Network",
  "Support Vector Machine"
];

export default function Playground() {
  const [selectedModel, setSelectedModel] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, message]);
      setMessage('');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.75rem', sm: '2.25rem' },
          mb: 3
        }}
      >
        Model Playground
      </Typography>

      {/* Controls Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4
        }}
      >
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel id="model-select-label">Select Model</InputLabel>
          <Select
            labelId="model-select-label"
            value={selectedModel}
            label="Select Model"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {availableModels.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          color="primary"
          sx={{ 
            minWidth: { xs: '100%', sm: 'auto' }
          }}
        >
          Upload Custom
        </Button>
      </Box>

      {/* Chat Interface */}
      <Paper 
        elevation={2}
        sx={{ 
          p: 2,
          height: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Chat History */}
        <Box 
          sx={{ 
            flexGrow: 1,
            overflowY: 'auto',
            mb: 2,
            p: 2
          }}
        >
          <Stack spacing={1}>
            {chatHistory.map((msg, index) => (
              <Paper 
                key={index}
                sx={{ 
                  p: 1.5,
                  maxWidth: '80%',
                  alignSelf: 'flex-end',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              >
                {msg}
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Message Input */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button 
            variant="contained"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
