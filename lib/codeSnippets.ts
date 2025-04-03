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
      code: `import json
import numpy as np
import onnxruntime as ort

def preprocess_text(text, vocab_file, scaler_file):
    with open(vocab_file, "r") as f:
        tfidf_data = json.load(f)
    vocab, idf = tfidf_data["vocab"], np.array(tfidf_data["idf"])
    
    with open(scaler_file, "r") as f:
        scaler_data = json.load(f)
    mean, scale = np.array(scaler_data["mean"]), np.array(scaler_data["scale"])
    
    # TF-IDF
    vector = np.zeros(5000, dtype=np.float32)
    words = text.lower().split()
    word_counts = {}
    for word in words:
        word_counts[word] = word_counts.get(word, 0) + 1
    for word, count in word_counts.items():
        if word in vocab:
            vector[vocab[word]] = count * idf[vocab[word]]
    
    # Scale
    vector = (vector - mean) / scale
    return vector

# Test
text = "This is a positive test string"
vector = preprocess_text(text, f"{MODELS_PATH}/{MODEL_PREFIX}_vocab.json", f"{MODELS_PATH}/{MODEL_PREFIX}_scaler.json")
session = ort.InferenceSession(f"{MODELS_PATH}/{MODEL_PREFIX}_pytorch.onnx")
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name
input_data = vector.reshape(1, 5000)
outputs = session.run([output_name], {input_name: input_data})
print("Python ONNX output:", outputs[0][0][0])`,
    },
    {
      language: 'javascript',
      displayName: 'JavaScript',
      code: `async function preprocessText(text, vocabUrl, scalerUrl) {
    const tfidfResp = await fetch(vocabUrl);
    const tfidfData = await tfidfResp.json();
    const vocab = tfidfData.vocab;
    const idf = tfidfData.idf;

    const scalerResp = await fetch(scalerUrl);
    const scalerData = await scalerResp.json();
    const mean = scalerData.mean;
    const scale = scalerData.scale;

    // TF-IDF
    const vector = new Float32Array(5000).fill(0);
    const words = text.toLowerCase().split(/\\s+/);
    const wordCounts = {};
    words.forEach(word => wordCounts[word] = (wordCounts[word] || 0) + 1);
    for (const word in wordCounts) {
        if (vocab[word] !== undefined) {
            vector[vocab[word]] = wordCounts[word] * idf[vocab[word]];
        }
    }

    // Scale
    for (let i = 0; i < 5000; i++) {
        vector[i] = (vector[i] - mean[i]) / scale[i];
    }
    return vector;
}

async function runModel(text) {
    const session = await ort.InferenceSession.create("text_classifier_pytorch.onnx");
    const vector = await preprocessText(text, "text_classifier_vocab.json", "text_classifier_scaler.json");
    const tensor = new ort.Tensor("float32", vector, [1, 5000]);
    const feeds = { float_input: tensor };
    const output = await session.run(feeds);
    console.log("JS ONNX output:", output.output.data[0]);
}

runModel("This is a positive test string");`,
    },
    {
      language: 'c',
      displayName: 'C',
      code: `#include <onnxruntime_c_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cjson/cJSON.h>

float* preprocess_text(const char* text, const char* vocab_file, const char* scaler_file) {
    float* vector = calloc(5000, sizeof(float));
    
    // Load JSON (simplified, assumes cJSON library)
    FILE* f = fopen(vocab_file, "r");
    fseek(f, 0, SEEK_END);
    long len = ftell(f);
    fseek(f, 0, SEEK_SET);
    char* json_str = malloc(len + 1);
    fread(json_str, 1, len, f);
    json_str[len] = 0;
    fclose(f);
    cJSON* tfidf_data = cJSON_Parse(json_str);
    cJSON* vocab = cJSON_GetObjectItem(tfidf_data, "vocab");
    cJSON* idf = cJSON_GetObjectItem(tfidf_data, "idf");
    
    f = fopen(scaler_file, "r");
    fseek(f, 0, SEEK_END);
    len = ftell(f);
    fseek(f, 0, SEEK_SET);
    char* scaler_str = malloc(len + 1);
    fread(scaler_str, 1, len, f);
    scaler_str[len] = 0;
    fclose(f);
    cJSON* scaler_data = cJSON_Parse(scaler_str);
    cJSON* mean = cJSON_GetObjectItem(scaler_data, "mean");
    cJSON* scale = cJSON_GetObjectItem(scaler_data, "scale");

    // TF-IDF
    char* text_copy = strdup(text);
    for (char* p = text_copy; *p; p++) *p = tolower(*p);
    char* word = strtok(text_copy, " \\t\\n");
    float word_counts[5000] = {0};
    while (word) {
        cJSON* idx = cJSON_GetObjectItem(vocab, word);
        if (idx) {
            int i = idx->valueint;
            word_counts[i] += cJSON_GetArrayItem(idf, i)->valuedouble;
        }
        word = strtok(NULL, " \\t\\n");
    }
    for (int i = 0; i < 5000; i++) {
        vector[i] = word_counts[i];
    }
    
    // Scale
    for (int i = 0; i < 5000; i++) {
        vector[i] = (vector[i] - cJSON_GetArrayItem(mean, i)->valuedouble) / cJSON_GetArrayItem(scale, i)->valuedouble;
    }
    
    free(text_copy); free(json_str); free(scaler_str);
    cJSON_Delete(tfidf_data); cJSON_Delete(scaler_data);
    return vector;
}

int main() {
    const char* text = "This is a positive test string";
    float* vector = preprocess_text(text, "text_classifier_vocab.json", "text_classifier_scaler.json");
    
    OrtEnv* env; OrtCreateEnv(ORT_LOGGING_LEVEL_WARNING, "test", &env);
    OrtSessionOptions* session_options; OrtCreateSessionOptions(&session_options);
    OrtSession* session; OrtCreateSession(env, "text_classifier_pytorch.onnx", session_options, &session);
    
    OrtMemoryInfo* memory_info; OrtCreateMemoryInfo("Cpu", OrtDeviceAllocator, 0, OrtMemTypeDefault, &memory_info);
    int64_t input_shape[] = {1, 5000};
    OrtValue* input_tensor; OrtCreateTensorWithDataAsOrtValue(memory_info, vector, 5000 * sizeof(float), input_shape, 2, ONNX_TENSOR_ELEMENT_DATA_TYPE_FLOAT, &input_tensor);
    
    const char* input_names[] = {"float_input"};
    const char* output_names[] = {"output"};
    OrtValue* output_tensor = NULL;
    OrtRun(session, NULL, input_names, (const OrtValue* const*)&input_tensor, 1, output_names, 1, &output_tensor);
    
    float* output_data; OrtGetTensorMutableData(output_tensor, (void**)&output_data);
    printf("C ONNX output: %f\\n", output_data[0]);
    
    free(vector); // Cleanup omitted for brevity
    return 0;
}`,
    },
    {
      language: 'cpp',
      displayName: 'C++',
      code: `#include <onnxruntime_cxx_api.h>
#include <fstream>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

std::vector<float> preprocess_text(const std::string& text, const std::string& vocab_file, const std::string& scaler_file) {
    std::vector<float> vector(5000, 0.0f);
    
    std::ifstream vf(vocab_file);
    json tfidf_data; vf >> tfidf_data;
    auto vocab = tfidf_data["vocab"];
    std::vector<float> idf = tfidf_data["idf"];
    
    std::ifstream sf(scaler_file);
    json scaler_data; sf >> scaler_data;
    std::vector<float> mean = scaler_data["mean"];
    std::vector<float> scale = scaler_data["scale"];
    
    // TF-IDF
    std::string text_lower = text;
    std::transform(text_lower.begin(), text_lower.end(), text_lower.begin(), ::tolower);
    std::map<std::string, int> word_counts;
    size_t start = 0, end;
    while ((end = text_lower.find(' ', start)) != std::string::npos) {
        if (end > start) word_counts[text_lower.substr(start, end - start)]++;
        start = end + 1;
    }
    if (start < text_lower.length()) word_counts[text_lower.substr(start)]++;
    for (const auto& [word, count] : word_counts) {
        if (vocab.contains(word)) {
            vector[vocab[word]] = count * idf[vocab[word]];
        }
    }
    
    // Scale
    for (int i = 0; i < 5000; i++) {
        vector[i] = (vector[i] - mean[i]) / scale[i];
    }
    return vector;
}

int main() {
    std::string text = "This is a positive test string";
    auto vector = preprocess_text(text, "text_classifier_vocab.json", "text_classifier_scaler.json");
    
    Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "test");
    Ort::SessionOptions session_options;
    Ort::Session session(env, "text_classifier_pytorch.onnx", session_options);
    
    std::vector<int64_t> input_shape = {1, 5000};
    Ort::MemoryInfo memory_info("Cpu", OrtDeviceAllocator, 0, OrtMemTypeDefault);
    Ort::Value input_tensor = Ort::Value::CreateTensor<float>(memory_info, vector.data(), vector.size(), input_shape.data(), input_shape.size());
    
    std::vector<const char*> input_names = {"float_input"};
    std::vector<const char*> output_names = {"output"};
    auto output_tensors = session.Run(Ort::RunOptions{nullptr}, input_names.data(), &input_tensor, 1, output_names.data(), 1);
    
    float* output_data = output_tensors[0].GetTensorMutableData<float>();
    std::cout << "C++ ONNX output: " << output_data[0] << std::endl;
    return 0;
}`,
    },
          {
      language: 'rust',
      displayName: 'Rust',
      code: `use ort::{Environment, Session, Tensor};
use std::fs::File;
use std::collections::HashMap;
use serde_json;

fn preprocess_text(text: &str, vocab_file: &str, scaler_file: &str) -> Vec<f32> {
    let mut vector = vec![0.0; 5000];
    
    let vf = File::open(vocab_file).unwrap();
    let tfidf_data: serde_json::Value = serde_json::from_reader(vf).unwrap();
    let vocab: HashMap<String, usize> = serde_json::from_value(tfidf_data["vocab"].clone()).unwrap();
    let idf: Vec<f32> = serde_json::from_value(tfidf_data["idf"].clone()).unwrap();
    
    let sf = File::open(scaler_file).unwrap();
    let scaler_data: serde_json::Value = serde_json::from_reader(sf).unwrap();
    let mean: Vec<f32> = serde_json::from_value(scaler_data["mean"].clone()).unwrap();
    let scale: Vec<f32> = serde_json::from_value(scaler_data["scale"].clone()).unwrap();
    
    // TF-IDF
    let words: Vec<&str> = text.to_lowercase().split_whitespace().collect();
    let mut word_counts = HashMap::new();
    for word in words {
        *word_counts.entry(word.to_string()).or_insert(0) += 1;
    }
    for (word, count) in word_counts {
        if let Some(&idx) = vocab.get(&word) {
            vector[idx] = count as f32 * idf[idx];
        }
    }
    
    // Scale
    for i in 0..5000 {
        vector[i] = (vector[i] - mean[i]) / scale[i];
    }
    vector
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let text = "This is a positive test string";
    let vector = preprocess_text(text, "text_classifier_vocab.json", "text_classifier_scaler.json");
    
    let env = Environment::builder().with_name("test").build()?;
    let session = Session::builder()?.commit_from_file("text_classifier_pytorch.onnx")?;
    
    let input_tensor = Tensor::from_array(([1, 5000], vector))?;
    let outputs = session.run(vec![input_tensor])?;
    let output: &Tensor<f32> = outputs[0].downcast_ref().unwrap();
    println!("Rust ONNX output: {}", output.as_slice()[0]);
    Ok(())
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