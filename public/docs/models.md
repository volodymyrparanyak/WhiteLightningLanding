# How Models Work

WhiteLightning.ai brews its models to classify text—like spotting spam or gauging sentiment—with a process as smooth as a backwoods still. Here’s how we distill LLM power into a lean, mean binary classifier:

- **Problem Input**: You toss us a classification task (e.g., "Sniff out spam emails").
- **Prompt Fermentation**: Our CLI whips up clever prompts, coaxing an LLM to churn out synthetic labeled data (e.g., spam vs. ham samples).
- **Preprocessing Mash**: Text gets mashed into numbers with TF-IDF vectorization (up to 5000 features) and smoothed out with StandardScaler for a consistent kick.
- **Training Distillation**: We fire up one of three rigs—TensorFlow, PyTorch, or Scikit-learn—to distill the data. The neural nets (512→256→1 layers, ReLU, and sigmoid) or Gradient Boosting Classifier boil it down to a potent essence.
- **ONNX Bottling**: The final brew is poured into an ONNX bottle—a lightweight, cross-platform format ready to run anywhere, from browsers to edge devices.

The payoff? A compact model with the sharp taste of LLM smarts, minus the heavy barrels. It’s moonshine AI: distilled once, deployed everywhere.