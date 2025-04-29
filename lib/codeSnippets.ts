export interface CodeSnippet {
  language: string;
  code: string;
  displayName: string;
}

export interface CodeSnippetCollection {
  [key: string]: CodeSnippet[];
}

export const CODE_SNIPPETS_BINARY: CodeSnippetCollection = {
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

export const CODE_SNIPPETS_MULTICLASS: CodeSnippetCollection = {
  modelRunning: [
    {
      language: 'python',
      displayName: 'Python',
      code: `import json
import numpy as np
import onnxruntime as ort

def preprocess_text(text, tokenizer_file):
    with open(tokenizer_file, 'r') as f:
        tokenizer = json.load(f)
    
    oov_token = '<OOV>'
    words = text.lower().split()
    sequence = [tokenizer.get(word, tokenizer.get(oov_token, 1)) for word in words]
    sequence = sequence[:30]  # Truncate to max_len
    padded = np.zeros(30, dtype=np.int32)
    padded[:len(sequence)] = sequence  # Pad with zeros
    return padded

# Test
text = "The government announced new policies to boost the economy"
vector = preprocess_text(text, 'news_classifier_tokenizer.json')

session = ort.InferenceSession('news_classifier.onnx')
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name
input_data = vector.reshape(1, 30)
outputs = session.run([output_name], {input_name: input_data})

# Load label map
with open('news_classifier_scaler.json', 'r') as f:
    label_map = json.load(f)

probabilities = outputs[0][0]
predicted_idx = np.argmax(probabilities)
label = label_map[str(predicted_idx)]
score = probabilities[predicted_idx]
print(f'Python ONNX output: {label} (Score: {score:.4f})')`,
    },
    {
      language: 'javascript',
      displayName: 'JavaScript',
      code: `async function preprocessText(text, tokenizerUrl) {
    const tokenizerResp = await fetch(tokenizerUrl);
    const tokenizer = await tokenizerResp.json();
    
    const oovToken = '<OOV>';
    const words = text.toLowerCase().split(/\\s+/);
    const sequence = words.map(word => tokenizer[word] || tokenizer[oovToken] || 1).slice(0, 30);
    const padded = new Int32Array(30).fill(0);
    sequence.forEach((val, idx) => padded[idx] = val);
    return padded;
}

async function runModel(text) {
    const session = await ort.InferenceSession.create('news_classifier.onnx');
    const vector = await preprocessText(text, 'news_classifier_tokenizer.json');
    const tensor = new ort.Tensor('int32', vector, [1, 30]);
    const feeds = { input: tensor };
    const output = await session.run(feeds);
    
    const labelResp = await fetch('news_classifier_scaler.json');
    const labelMap = await labelResp.json();
    
    const probabilities = output[Object.keys(output)[0]].data;
    const predictedIdx = probabilities.reduce((maxIdx, val, idx) => val > probabilities[maxIdx] ? idx : maxIdx, 0);
    const label = labelMap[predictedIdx];
    const score = probabilities[predictedIdx];
    console.log(\`JS ONNX output: \${label} (Score: \${score.toFixed(4)})\`);
}

runModel('The government announced new policies to boost the economy');`,
    },
    {
      language: 'c',
      displayName: 'C',
      code: `#include <onnxruntime_c_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cjson/cJSON.h>

int32_t* preprocess_text(const char* text, const char* tokenizer_file) {
    int32_t* vector = calloc(30, sizeof(int32_t));
    
    FILE* f = fopen(tokenizer_file, "r");
    fseek(f, 0, SEEK_END);
    long len = ftell(f);
    fseek(f, 0, SEEK_SET);
    char* json_str = malloc(len + 1);
    fread(json_str, 1, len, f);
    json_str[len] = 0;
    fclose(f);
    cJSON* tokenizer = cJSON_Parse(json_str);
    
    char* text_copy = strdup(text);
    for (char* p = text_copy; *p; p++) *p = tolower(*p);
    char* word = strtok(text_copy, " \\t\\n");
    int idx = 0;
    while (word && idx < 30) {
        cJSON* token = cJSON_GetObjectItem(tokenizer, word);
        vector[idx++] = token ? token->valueint : (cJSON_GetObjectItem(tokenizer, "<OOV>") ? cJSON_GetObjectItem(tokenizer, "<OOV>")->valueint : 1);
        word = strtok(NULL, " \\t\\n");
    }
    
    free(text_copy); free(json_str); cJSON_Delete(tokenizer);
    return vector;
}

int main() {
    const char* text = "The government announced new policies to boost the economy";
    int32_t* vector = preprocess_text(text, "news_classifier_tokenizer.json");
    
    OrtEnv* env; OrtCreateEnv(ORT_LOGGING_LEVEL_WARNING, "test", &env);
    OrtSessionOptions* session_options; OrtCreateSessionOptions(&session_options);
    OrtSession* session; OrtCreateSession(env, "news_classifier.onnx", session_options, &session);
    
    OrtMemoryInfo* memory_info; OrtCreateMemoryInfo("Cpu", OrtDeviceAllocator, 0, OrtMemTypeDefault, &memory_info);
    int64_t input_shape[] = {1, 30};
    OrtValue* input_tensor; OrtCreateTensorWithDataAsOrtValue(memory_info, vector, 30 * sizeof(int32_t), input_shape, 2, ONNX_TENSOR_ELEMENT_DATA_TYPE_INT32, &input_tensor);
    
    const char* input_names[] = {"input"};
    const char* output_names[] = {"output"};
    OrtValue* output_tensor = NULL;
    OrtRun(session, NULL, input_names, (const OrtValue* const*)&input_tensor, 1, output_names, 1, &output_tensor);
    
    float* output_data; OrtGetTensorMutableData(output_tensor, (void**)&output_data);
    
    FILE* f = fopen("news_classifier_scaler.json", "r");
    fseek(f, 0, SEEK_END);
    long len = ftell(f);
    fseek(f, 0, SEEK_SET);
    char* json_str = malloc(len + 1);
    fread(json_str, 1, len, f);
    json_str[len] = 0;
    fclose(f);
    cJSON* label_map = cJSON_Parse(json_str);
    
    int predicted_idx = 0;
    float max_prob = output_data[0];
    for (int i = 1; i < cJSON_GetArraySize(label_map); i++) {
        if (output_data[i] > max_prob) {
            max_prob = output_data[i];
            predicted_idx = i;
        }
    }
    
    char idx_str[16]; snprintf(idx_str, sizeof(idx_str), "%d", predicted_idx);
    cJSON* label = cJSON_GetObjectItem(label_map, idx_str);
    printf("C ONNX output: %s (Score: %.4f)\\n", label->valuestring, max_prob);
    
    free(vector); free(json_str); cJSON_Delete(label_map);
    // Cleanup omitted for brevity
    return 0;
}`,
    },
    {
      language: 'cpp',
      displayName: 'C++',
      code: `#include <onnxruntime_cxx_api.h>
#include <fstream>
#include <nlohmann/json.hpp>
#include <algorithm>
using json = nlohmann::json;

std::vector<int32_t> preprocess_text(const std::string& text, const std::string& tokenizer_file) {
    std::vector<int32_t> vector(30, 0);
    
    std::ifstream tf(tokenizer_file);
    json tokenizer; tf >> tokenizer;
    
    std::string text_lower = text;
    std::transform(text_lower.begin(), text_lower.end(), text_lower.begin(), ::tolower);
    std::vector<std::string> words;
    size_t start = 0, end;
    while ((end = text_lower.find(' ', start)) != std::string::npos) {
        if (end > start) words.push_back(text_lower.substr(start, end - start));
        start = end + 1;
    }
    if (start < text_lower.length()) words.push_back(text_lower.substr(start));
    
    for (size_t i = 0; i < std::min(words.size(), size_t(30)); i++) {
        auto it = tokenizer.find(words[i]);
        if (it != tokenizer.end()) {
            vector[i] = it->get<int>();
        } else {
            auto oov = tokenizer.find("<OOV>");
            vector[i] = oov != tokenizer.end() ? oov->get<int>() : 1;
        }
    }
    return vector;
}

int main() {
    std::string text = "The government announced new policies to boost the economy";
    auto vector = preprocess_text(text, "news_classifier_tokenizer.json");
    
    Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "test");
    Ort::SessionOptions session_options;
    Ort::Session session(env, "news_classifier.onnx", session_options);
    
    std::vector<int64_t> input_shape = {1, 30};
    Ort::MemoryInfo memory_info("Cpu", OrtDeviceAllocator, 0, OrtMemTypeDefault);
    Ort::Value input_tensor = Ort::Value::CreateTensor<int32_t>(memory_info, vector.data(), vector.size(), input_shape.data(), input_shape.size());
    
    std::vector<const char*> input_names = {"input"};
    std::vector<const char*> output_names = {"output"};
    auto output_tensors = session.Run(Ort::RunOptions{nullptr}, input_names.data(), &input_tensor, 1, output_names.data(), 1);
    
    float* output_data = output_tensors[0].GetTensorMutableData<float>();
    size_t output_size = output_tensors[0].GetTensorTypeAndShapeInfo().GetElementCount();
    
    std::ifstream lf("news_classifier_scaler.json");
    json label_map; lf >> label_map;
    
    auto max_it = std::max_element(output_data, output_data + output_size);
    int predicted_idx = std::distance(output_data, max_it);
    std::string label = label_map[std::to_string(predicted_idx)];
    float score = *max_it;
    
    std::cout << "C++ ONNX output: " << label << " (Score: " << std::fixed << std::setprecision(4) << score << ")" << std::endl;
    return 0;
}`,
    },
    {
      language: 'rust',
      displayName: 'Rust',
      code: `use ort::{Environment, Session, Tensor};
use std::fs::File;
use serde_json::{self, Value};
use std::collections::HashMap;

fn preprocess_text(text: &str, tokenizer_file: &str) -> Vec<i32> {
    let mut vector = vec![0; 30];
    
    let tf = File::open(tokenizer_file).unwrap();
    let tokenizer: HashMap<String, i32> = serde_json::from_reader(tf).unwrap();
    
    let words: Vec<&str> = text.to_lowercase().split_whitespace().collect();
    for (i, word) in words.iter().take(30).enumerate() {
        vector[i] = *tokenizer.get(*word).unwrap_or_else(|| tokenizer.get("<OOV>").unwrap_or(&1));
    }
    vector
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let text = "The government announced new policies to boost the economy";
    let vector = preprocess_text(text, "news_classifier_tokenizer.json");
    
    let env = Environment::builder().with_name("test").build()?;
    let session = Session::builder()?.commit_from_file("news_classifier.onnx")?;
    
    let input_tensor = Tensor::from_array(([1, 30], vector))?;
    let outputs = session.run(vec![input_tensor])?;
    let output: &Tensor<f32> = outputs[0].downcast_ref().unwrap();
    let probabilities = output.as_slice();
    
    let lf = File::open("news_classifier_scaler.json")?;
    let label_map: HashMap<String, String> = serde_json::from_reader(lf)?;
    
    let (predicted_idx, &score) = probabilities.iter().enumerate()
        .max_by(|a, b| a.1.partial_cmp(b.1).unwrap()).unwrap();
    let label = label_map.get(&predicted_idx.to_string()).unwrap();
    
    println!("Rust ONNX output: {} (Score: {:.4})", label, score);
    Ok(())
}`,
    },
    {
        language: 'java',
        displayName: 'Java',
        code: `
      import ai.onnxruntime.*;
      import org.json.JSONObject;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.*;
      
      public class ONNXModelRunner {
          public static void main(String[] args) {
              try {
                  LabelVocabLoader loader = new LabelVocabLoader("resources/labelMap.json", "resources/vocab.json");
                  Map<Integer, String> labelMap = loader.getLabelMap();
                  Map<String, Integer> vocab = loader.getVocab();
      
                  String modelPath = "resources/model.onnx";
                  OrtEnvironment env = OrtEnvironment.getEnvironment();
                  OrtSession session = env.createSession(modelPath, new OrtSession.SessionOptions());
      
                  String inputText = "let's go to the beach and have some fun";
      
                  Tokenizer tokenizer = new Tokenizer(vocab);
                  int maxLen = 30;
                  int[] tokenizedInput = tokenizer.tokenize(inputText);
                  int[] paddedInput = new int[maxLen];
                  for (int i = 0; i < maxLen; i++) {
                      if (i < tokenizedInput.length) {
                          paddedInput[i] = tokenizedInput[i];
                      } else {
                          paddedInput[i] = 0;
                      }
                  }
      
                  int[][] inputData = new int[1][maxLen];
                  inputData[0] = paddedInput;
      
                  OnnxTensor inputTensor = OnnxTensor.createTensor(env, inputData);
      
                  String inputName = session.getInputNames().iterator().next();
                  OrtSession.Result result = session.run(Collections.singletonMap(inputName, inputTensor));
      
                  float[][] outputArray = (float[][]) result.get(0).getValue();
                  System.out.println("Model output:");
                  for (int i = 0; i < outputArray[0].length; i++) {
                      System.out.println("Class: " + labelMap.get(i) + ", Probability: " + outputArray[0][i]);
                  }
      
                  session.close();
                  env.close();
              } catch (Exception e) {
                  e.printStackTrace();
              }
          }
      
          static class Tokenizer {
              private Map<String, Integer> vocab;
      
              public Tokenizer(Map<String, Integer> vocab) {
                  this.vocab = vocab;
              }
      
              public int[] tokenize(String text) {
                  String[] words = text.toLowerCase().split("\\s+");
                  int[] tokenized = new int[words.length];
                  for (int i = 0; i < words.length; i++) {
                      Integer token = vocab.getOrDefault(words[i], vocab.get("<OOV>"));
                      tokenized[i] = token;
                  }
                  return tokenized;
              }
          }
      
          static class LabelVocabLoader {
              private Map<Integer, String> labelMap;
              private Map<String, Integer> vocab;
      
              public LabelVocabLoader(String labelMapPath, String vocabPath) throws Exception {
                  String labelMapJson = new String(Files.readAllBytes(Paths.get(labelMapPath)));
                  JSONObject labelMapObject = new JSONObject(labelMapJson);
                  this.labelMap = new HashMap<>();
                  for (String key : labelMapObject.keySet()) {
                      this.labelMap.put(Integer.parseInt(key), labelMapObject.getString(key));
                  }
      
                  String vocabJson = new String(Files.readAllBytes(Paths.get(vocabPath)));
                  JSONObject vocabObject = new JSONObject(vocabJson);
                  this.vocab = new HashMap<>();
                  for (String key : vocabObject.keySet()) {
                      this.vocab.put(key, vocabObject.getInt(key));
                  }
              }
      
              public Map<Integer, String> getLabelMap() {
                  return labelMap;
              }
      
              public Map<String, Integer> getVocab() {
                  return vocab;
              }
          }
      }`
      }
      
  ],
};