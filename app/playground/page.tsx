'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as ort from 'onnxruntime-web';

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

  return (
    <div style={styles.container}>
      <div style={styles.modelSelector}>
        <select
          value={selectedModel}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModel(e.target.value)}
          style={styles.dropdown}
        >
          <option value="">Select a model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.chatContainer} ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(message.isUser ? styles.userMessage : styles.botMessage),
            }}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={inputText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
          placeholder="Enter text to classify..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>
          Classify
        </button>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  modelSelector: {
    marginBottom: '20px',
  },
  dropdown: {
    padding: '8px',
    width: '200px',
    fontSize: '16px',
  },
  chatContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  message: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    maxWidth: '70%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    marginLeft: 'auto',
  },
  botMessage: {
    backgroundColor: '#e9ecef',
    marginRight: 'auto',
  },
  inputForm: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};