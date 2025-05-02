import * as ort from 'onnxruntime-web';

async function loadBinaryArtifacts(modelPathPrefix) {
  const tfidfResp = await fetch(`${modelPathPrefix}/vocab.json`);
  const tfidfData = await tfidfResp.json();
  const scalerResp = await fetch(`${modelPathPrefix}/scaler.json`);
  const scalerData = await scalerResp.json();
  return {
    vocab: tfidfData.vocab,
    idf: tfidfData.idf,
    mean: scalerData.mean,
    scale: scalerData.scale,
  };
}

async function preprocessBinaryText(text, artifacts) {
  const { vocab, idf, mean, scale } = artifacts;
  const vector = new Float32Array(5000).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  const wordCounts = Object.create(null);
  words.forEach(word => (wordCounts[word] = (wordCounts[word] || 0) + 1));
  for (const word in wordCounts) {
    if (vocab[word] !== undefined) {
      vector[vocab[word]] = wordCounts[word] * idf[vocab[word]];
    }
  }
  // Scale the vector
  for (let i = 0; i < 5000; i++) {
    vector[i] = (vector[i] - mean[i]) / scale[i];
  }
  return vector;
}

async function runBinaryInference(session, text, artifacts) {
  const vector = await preprocessBinaryText(text, artifacts);
  const tensor = new ort.Tensor('float32', vector, [1, 5000]);
  const feeds = { float_input: tensor };
  const results = await session.run(feeds);
  const probability = results['output'].data[0];
  const prediction = probability > 0.5 ? 1 : 0;
  const label = prediction === 1 ? 'Positive' : 'Negative';
  return { label, probability };
}

export { loadBinaryArtifacts, preprocessBinaryText, runBinaryInference };
