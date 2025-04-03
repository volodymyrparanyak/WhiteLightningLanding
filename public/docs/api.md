# Running ONNX Models

Ready to pour your WhiteLightning.ai ONNX models into action? Here’s how to run them across different platforms, from Python scripts to edge devices. These snippets assume a preprocessed input vector of 5000 features—our secret recipe for turning text into numbers. Use WhiteLightning.ai’s CLI to whip up and preprocess your data for real-world sips; we’ll show you the distillation process below.

### Preprocessing: Crafting the Vector

Our models expect a 5000-dimensional float vector, brewed from raw text using TF-IDF (term frequency-inverse document frequency) and standardized scaling. Here’s the gist:
- **Text Input**: Start with your string (e.g., "This is a positive test").
- **TF-IDF Magic**: Map words to a 5000-feature space using a pre-trained vocabulary and IDF weights (exported as `_vocab.json`).
- **Scaling**: Normalize the features with mean and scale values (from `_scaler.json`) to keep the brew balanced.
- **Output**: A 5000-element `float32` array, ready to pour into the ONNX model.
