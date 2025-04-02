# How Models Work

WhiteLightning.ai models are built to classify text (e.g., spam detection, sentiment analysis) using a streamlined process:

- **Problem Input:** Users describe a classification task (e.g., "Detect spam emails").
- **Prompt Generation:** The CLI crafts prompts for LLMs to generate synthetic labeled data (e.g., spam vs. non-spam examples).
- **Preprocessing:** Text is transformed into numerical features using TF-IDF vectorization (up to 5000 features) and standardized with StandardScaler for consistency.
- **Training:** A TensorFlow neural network (512→256→1 layers with ReLU and sigmoid activations) learns to classify the data, distilled into a compact form.
- **Export:** The trained model is converted to ONNX, a lightweight format optimized for cross-platform inference.

The result? A small, efficient model with the distilled essence of LLM intelligence, ready for deployment.