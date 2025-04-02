# Usage Guide

The WhiteLightning.ai library provides a simple API to integrate binary classifiers into your applications.

## Installation

```bash
npm install whitelightning-ai
```

Or if you're using yarn:

```bash
yarn add whitelightning-ai
```

## Basic Usage

```javascript
import { Classifier } from 'whitelightning-ai';

// Initialize
const classifier = new Classifier({
  modelPath: './path/to/your/model.onnx',
  preprocess: true  // Enable automatic preprocessing
});

// Classify a sample
const result = await classifier.predict('Text to classify');
console.log(`Classification: ${result.label}, Score: ${result.score}`);
```

## Advanced Configuration

```javascript
const classifier = new Classifier({
  modelPath: './path/to/your/model.onnx',
  preprocess: {
    tokenizer: 'whitespace',  // 'whitespace', 'wordpiece', or custom function
    maxFeatures: 5000,
    normalize: true
  },
  threshold: 0.75,  // Custom threshold for binary classification 
  labels: ['negative', 'positive']  // Custom label names
});
```