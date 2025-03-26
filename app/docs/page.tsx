'use client';

import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { Sidebar, Content } from '../../lib/styledComponents'; // Adjust path
import { useRef } from 'react';

export default function Docs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sectionRefs = {
    overview: useRef<HTMLElement>(null),
    howModelsWork: useRef<HTMLElement>(null),
    onnxExplained: useRef<HTMLElement>(null),
    runningOnnx: useRef<HTMLElement>(null),
  };

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `radial-gradient(circle, ${theme.palette.grey[800]} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium', color: theme.palette.grey[100] }}>
            Documentation
          </Typography>
          <List>
            <ListItem button onClick={() => scrollToSection(sectionRefs.overview)}>
              <ListItemText primary="Overview" sx={{ color: theme.palette.text.secondary }} />
            </ListItem>
            <ListItem button onClick={() => scrollToSection(sectionRefs.howModelsWork)}>
              <ListItemText primary="How Models Work" sx={{ color: theme.palette.text.secondary }} />
            </ListItem>
            <ListItem button onClick={() => scrollToSection(sectionRefs.onnxExplained)}>
              <ListItemText primary="ONNX Explained" sx={{ color: theme.palette.text.secondary }} />
            </ListItem>
            <ListItem button onClick={() => scrollToSection(sectionRefs.runningOnnx)}>
              <ListItemText primary="Running ONNX Models" sx={{ color: theme.palette.text.secondary }} />
            </ListItem>
          </List>
        </Sidebar>

        <Content>
          <section ref={sectionRefs.overview}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.grey[100] }}>
              Overview
            </Typography>
            <Typography sx={{ mb: 4, color: theme.palette.text.secondary }}>
              WhiteLightning.ai is a playground and toolkit for distilling the power of large language models (LLMs) into compact, efficient binary classifiers. Using knowledge distillation, we generate synthetic training data from user-defined problems and train lightweight ONNX models that run anywhere—from your browser to edge devices. Think of it as moonshine AI: potent, portable, and fast.
            </Typography>
          </section>

          <Divider sx={{ my: 4, borderColor: theme.palette.grey[700] }} />

          <section ref={sectionRefs.howModelsWork}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.grey[100] }}>
              How Models Work
            </Typography>
            <Typography sx={{ mb: 2, color: theme.palette.text.secondary }}>
              WhiteLightning.ai models are built to classify text (e.g., spam detection, sentiment analysis) using a streamlined process:
            </Typography>
            <Typography component="ul" sx={{ mb: 2, color: theme.palette.text.secondary, pl: 4 }}>
              <li>
                <strong>Problem Input:</strong> Users describe a classification task (e.g., “Detect spam emails”).
              </li>
              <li>
                <strong>Prompt Generation:</strong> The CLI crafts prompts for LLMs to generate synthetic labeled data (e.g., spam vs. non-spam examples).
              </li>
              <li>
                <strong>Preprocessing:</strong> Text is transformed into numerical features using TF-IDF vectorization (up to 5000 features) and standardized with StandardScaler for consistency.
              </li>
              <li>
                <strong>Training:</strong> A TensorFlow neural network (512→256→1 layers with ReLU and sigmoid activations) learns to classify the data, distilled into a compact form.
              </li>
              <li>
                <strong>Export:</strong> The trained model is converted to ONNX, a lightweight format optimized for cross-platform inference.
              </li>
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              The result? A small, efficient model with the distilled essence of LLM intelligence, ready for deployment.
            </Typography>
          </section>

          <Divider sx={{ my: 4, borderColor: theme.palette.grey[700] }} />

          <section ref={sectionRefs.onnxExplained}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.grey[100] }}>
              ONNX Explained
            </Typography>
            <Typography sx={{ mb: 2, color: theme.palette.text.secondary }}>
              ONNX (Open Neural Network Exchange) is an open-source format for representing machine learning models. It’s the backbone of WhiteLightning.ai’s portability, allowing models trained in TensorFlow to run on diverse platforms without retraining.
            </Typography>
            <Typography component="ul" sx={{ mb: 2, color: theme.palette.text.secondary, pl: 4 }}>
              <li><strong>Interoperability:</strong> Use the same model in Python, JavaScript, C++, Java, and more.</li>
              <li><strong>Performance:</strong> Optimized for fast inference on CPUs, GPUs, and edge devices.</li>
              <li><strong>Compactness:</strong> Small file sizes make it ideal for deployment anywhere.</li>
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              With ONNX, WhiteLightning.ai delivers distilled AI that’s as versatile as moonshine in a mason jar.
            </Typography>
          </section>

          <Divider sx={{ my: 4, borderColor: theme.palette.grey[700] }} />

          <section ref={sectionRefs.runningOnnx}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.grey[100] }}>
              Running ONNX Models
            </Typography>
            <Typography sx={{ mb: 2, color: theme.palette.text.secondary }}>
              Here’s how to run your WhiteLightning.ai ONNX models on different platforms:
            </Typography>

            <Typography variant="h6" sx={{ mt: 2, color: theme.palette.grey[100] }}>Python</Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <pre style={{ color: theme.palette.text.secondary }}>
                {`import onnxruntime as rt
import numpy as np

# Load model
session = rt.InferenceSession("model.onnx")
input_name = session.get_inputs()[0].name

# Prepare input (5000 features)
input_data = np.zeros((1, 5000), dtype=np.float32)
feeds = {input_name: input_data}

# Run inference
results = session.run(None, feeds)
print("Probability:", results[0])`}
              </pre>
            </Paper>

            <Typography variant="h6" sx={{ mt: 2, color: theme.palette.grey[100] }}>JavaScript (Browser)</Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <pre style={{ color: theme.palette.text.secondary }}>
                {`import * as ort from 'onnxruntime-web';

// Load model
const session = await ort.InferenceSession.create('model.onnx');

// Prepare input
const input = new ort.Tensor('float32', new Float32Array(5000), [1, 5000]);
const feeds = { 'float_input': input };

// Run inference
const results = await session.run(feeds);
console.log('Probability:', results['output'].data[0]);`}
              </pre>
            </Paper>
            <Typography variant="h6" sx={{ mt: 2, color: theme.palette.grey[100] }}>Java</Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <pre style={{ color: theme.palette.text.secondary }}>
                {`import ai.onnxruntime.*;

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
}`}
              </pre>
            </Paper>

            <Typography sx={{ color: theme.palette.text.secondary }}>
              These snippets assume a preprocessed input vector of 5000 features. Use WhiteLightning.ai’s CLI to generate and preprocess data for real-world use.
            </Typography>
          </section>
        </Content>
      </Container>
    </Box>
  );
}