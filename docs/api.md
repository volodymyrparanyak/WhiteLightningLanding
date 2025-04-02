# Running ONNX Models

Here's how to run your WhiteLightning.ai ONNX models on different platforms:

## Python

```python
import onnxruntime as rt
import numpy as np

# Load model
session = rt.InferenceSession("model.onnx")
input_name = session.get_inputs()[0].name

# Prepare input (5000 features)
input_data = np.zeros((1, 5000), dtype=np.float32)
feeds = {input_name: input_data}

# Run inference
results = session.run(None, feeds)
print("Probability:", results[0])
```

## JavaScript (Browser)

```javascript
import * as ort from 'onnxruntime-web';

// Load model
const session = await ort.InferenceSession.create('model.onnx');

// Prepare input
const input = new ort.Tensor('float32', new Float32Array(5000), [1, 5000]);
const feeds = { 'float_input': input };

// Run inference
const results = await session.run(feeds);
console.log('Probability:', results['output'].data[0]);
```

## Java

```java
import ai.onnxruntime.*;

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
}
```

These snippets assume a preprocessed input vector of 5000 features. Use WhiteLightning.ai's CLI to generate and preprocess data for real-world use.