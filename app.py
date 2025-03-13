import streamlit as st

st.set_page_config(
    page_title="Binary Classifier Documentation",
    page_icon="🤖",
    layout="wide"
)

st.title("Binary Classifier Library")
st.markdown("""
Welcome to the Binary Classifier Library documentation and playground!

This library provides simple and efficient tools for binary classification tasks.
Use the sidebar to navigate between:

- 📚 **Documentation**: Comprehensive guide and API reference
- 🎮 **Playground**: Interactive testing environment for our models

### Quick Start

```python
from binary_classifier import LogisticClassifier

# Create and train model
model = LogisticClassifier()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
```

Get started by selecting a section from the sidebar!
""")