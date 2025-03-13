# Usage Guide

## Model Selection

The library provides multiple classification algorithms:

1. Logistic Regression
2. Random Forest

Choose based on your specific needs:

- Logistic Regression: Simple, interpretable, works well with linear relationships
- Random Forest: More complex, handles non-linear relationships, generally more accurate

## Training

All models follow the same training pattern:

```python
# Create model
model = LogisticClassifier()

# Train
model.fit(X_train, y_train)
