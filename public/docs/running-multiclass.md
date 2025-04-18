# Running Multiclass Classifier Models

Ready to unleash your WhiteLightning.ai ONNX multiclass models? These snippets show how to run them across various languages, from Python to Rust, for classifying text into multiple categories (e.g., Politics, Sports, Business). Each snippet assumes a preprocessed input of 30 integer token IDs, crafted from raw text using a tokenizer. Use WhiteLightning.ai’s CLI to prepare your data; below, we break down the process for smooth deployment.

### Preprocessing: Tokenizing the Text

The multiclass model expects a 30-dimensional `int32` vector of token IDs, created from text using a pre-trained tokenizer. Here’s how it works:
- **Text Input**: Start with a string (e.g., "The government announced new policies").
- **Tokenization**: Convert words to lowercase and map them to integer IDs using a tokenizer vocabulary (from `_tokenizer.json`). Unknown words use the `<OOV>` token (default ID: 1).
- **Padding/Truncation**: Truncate to 30 tokens and pad with zeros to ensure a fixed-length sequence.
- **Output**: A 30-element `int32` array, ready for the ONNX model.

### Inference: Classifying the Text

Once preprocessed, the input is fed into the ONNX model for classification:
- **Model Loading**: Load the ONNX model (`news_classifier.onnx`) using the ONNX Runtime.
- **Inference**: Pass the `[1, 30]` `int32` tensor to the model, which outputs a softmax probability distribution over classes.
- **Label Mapping**: Load the label map (from `_scaler.json`) to convert the highest-probability index to a class name (e.g., "Politics").
- **Output**: The predicted class and its probability score (e.g., "Politics (Score: 0.9123)").