import * as ort from 'onnxruntime-web';

async function loadMulticlassArtifacts(modelPathPrefix) {
  const tokenizerResp = await fetch(`${modelPathPrefix}/vocab.json`);
  const labelMapResp = await fetch(`${modelPathPrefix}/scaler.json`);
  return {
    tokenizer: await tokenizerResp.json(),
    labelMap: await labelMapResp.json(),
  };
}

function preprocessMulticlassText(text, tokenizer, maxLen = 30) {
  const oovToken = '<OOV>';
  const words = text.toLowerCase().split(/\s+/);
  let sequence = words.map((word) => tokenizer[word] || tokenizer[oovToken] || 1);
  sequence = sequence.slice(0, maxLen); // Truncate to maxLen
  const padded = new Array(maxLen).fill(0); // Pad with zeros
  sequence.forEach((val, idx) => (padded[idx] = val));
  return padded;
}

// Run inference for multiclass classification
async function runMulticlassInference(session, text, artifacts) {
  const { tokenizer, labelMap } = artifacts;
  const tokenized = preprocessMulticlassText(text, tokenizer);
  const inputArray = new Int32Array(tokenized); // Use Int32Array instead of Float32Array
  const tensor = new ort.Tensor('int32', inputArray, [1, 30]); // Use int32 tensor type
  const feeds = { input: tensor };
  const results = await session.run(feeds);
  const outputTensor = results[Object.keys(results)[0]];
  const probabilities = outputTensor.data;
  const predictedClassIdx = probabilities.reduce((maxIdx, val, idx) =>
    val > probabilities[maxIdx] ? idx : maxIdx, 0);
  const label = labelMap[predictedClassIdx];
  const probability = probabilities[predictedClassIdx];
  return { label, probability };
}

export { loadMulticlassArtifacts, preprocessMulticlassText, runMulticlassInference };