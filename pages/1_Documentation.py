import streamlit as st
import os

st.set_page_config(
    page_title="Documentation - Binary Classifier",
    page_icon="📚",
    layout="wide"
)

def load_doc(filename):
    with open(os.path.join("docs", filename), "r") as f:
        return f.read()

st.title("Documentation")

# Chapter selection
chapter = st.sidebar.radio(
    "Select Chapter",
    ["Introduction", "Usage Guide", "API Reference"]
)

if chapter == "Introduction":
    st.markdown(load_doc("introduction.md"))
elif chapter == "Usage Guide":
    st.markdown(load_doc("usage.md"))
else:
    st.markdown(load_doc("api.md"))
