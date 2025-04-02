export interface CodeSnippet {
  language: string;
  code: string;
  displayName: string;
}

export interface CodeSnippetCollection {
  [key: string]: CodeSnippet[];
}

export const CODE_SNIPPETS: CodeSnippetCollection = {
  modelRunning: [
    {
      language: 'python',
      displayName: 'Python',
      code: `import onnxruntime as rt
import numpy as np

# Load model
session = rt.InferenceSession("model.onnx")
input_name = session.get_inputs()[0].name

# Prepare input (5000 features)
input_data = np.zeros((1, 5000), dtype=np.float32)
feeds = {input_name: input_data}

# Run inference
results = session.run(None, feeds)
print("Probability:", results[0])`,
    },
    {
      language: 'javascript',
      displayName: 'JavaScript',
      code: `import * as ort from 'onnxruntime-web';

// Load model
const session = await ort.InferenceSession.create('model.onnx');

// Prepare input
const input = new ort.Tensor('float32', new Float32Array(5000), [1, 5000]);
const feeds = { 'float_input': input };

// Run inference
const results = await session.run(feeds);
console.log('Probability:', results['output'].data[0]);`,
    },
    {
      language: 'java',
      displayName: 'Java',
      code: `import ai.onnxruntime.*;

public class Main {
    public static void main(String[] args) throws Exception {
        OrtEnvironment env = OrtEnvironment.getEnvironment();
        OrtSession session = env.createSession("model.onnx", new OrtSession.SessionOptions());

        float[] inputData = new float[5000];
        OnnxTensor inputTensor = OnnxTensor.createTensor(env, inputData, new long[]{1, 5000});
        Map<String, OnnxTensor> inputs = new HashMap<>();
        inputs.put("float_input", inputTensor);

        OrtSession.Result results = session.run(inputs);
        float[] outputData = (float[]) results.get("output").getValue();
        System.out.println("Probability: " + outputData[0]);
    }
}`,
    },
    {
      language: 'csharp',
      displayName: 'C#',
      code: `using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using System;
using System.Collections.Generic;

class Program {
    static void Main(string[] args) {
        // Create InferenceSession from ONNX model
        var session = new InferenceSession("model.onnx");
        
        // Create input tensor
        var inputData = new float[5000];
        var inputTensor = new DenseTensor<float>(inputData, new[] { 1, 5000 });
        
        // Setup inputs
        var inputs = new Dictionary<string, Tensor<float>> {
            { "float_input", inputTensor }
        };
        
        // Run inference
        var results = session.Run(inputs);
        var output = results.First().AsEnumerable<float>().First();
        
        Console.WriteLine($"Probability: {output}");
    }
}`,
    },
  ],
  installation: [
    {
      language: 'bash',
      displayName: 'npm',
      code: `npm install whitelightning-ai`,
    },
    {
      language: 'bash',
      displayName: 'yarn',
      code: `yarn add whitelightning-ai`,
    },
    {
      language: 'bash',
      displayName: 'Python',
      code: `pip install whitelightning-ai`,
    },
  ],
  basicUsage: [
    {
      language: 'javascript',
      displayName: 'JavaScript',
      code: `import { Classifier } from 'whitelightning-ai';

// Initialize
const classifier = new Classifier({
  modelPath: './path/to/your/model.onnx',
  preprocess: true  // Enable automatic preprocessing
});

// Classify a sample
const result = await classifier.predict('Text to classify');
console.log(\`Classification: \${result.label}, Score: \${result.score}\`);`,
    },
    {
      language: 'python',
      displayName: 'Python',
      code: `from whitelightning import Classifier

# Initialize
classifier = Classifier(
    model_path='./path/to/your/model.onnx',
    preprocess=True  # Enable automatic preprocessing
)

# Classify a sample
result = classifier.predict('Text to classify')
print(f"Classification: {result['label']}, Score: {result['score']}")`,
    },
  ],
  advancedConfig: [
    {
      language: 'javascript',
      displayName: 'JavaScript',
      code: `const classifier = new Classifier({
  modelPath: './path/to/your/model.onnx',
  preprocess: {
    tokenizer: 'whitespace',  // 'whitespace', 'wordpiece', or custom function
    maxFeatures: 5000,
    normalize: true
  },
  threshold: 0.75,  // Custom threshold for binary classification 
  labels: ['negative', 'positive']  // Custom label names
});`,
    },
    {
      language: 'python',
      displayName: 'Python',
      code: `classifier = Classifier(
    model_path='./path/to/your/model.onnx',
    preprocess={
        'tokenizer': 'whitespace',  # 'whitespace', 'wordpiece', or custom function
        'max_features': 5000,
        'normalize': True
    },
    threshold=0.75,  # Custom threshold for binary classification
    labels=['negative', 'positive']  # Custom label names
)`,
    },
  ],
};