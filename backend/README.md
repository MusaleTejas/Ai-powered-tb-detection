# 🧠 TB Care AI — Flask AI Inference Engine

The backend inference microservice for **TB Care AI**, serving deep learning multi-task classification, lung lesion segmentation, and Grad-CAM attention heatmap generation for chest radiographs.

---

## 🛠️ Tech Stack & Dependencies

- **Flask**: Python web API framework
- **Flask-CORS**: Cross-origin resource sharing
- **TensorFlow 2.x & Keras**: SavedModel neural network inference
- **OpenCV (`opencv-python`)**: Radiograph preprocessing, heatmap color mapping, and segmentation overlay rendering
- **NumPy & Pillow**: Array manipulation and image encoding

---

## 🚀 Installation & Local Run

```bash
# 1. Create a Python virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# 3. Install required packages
pip install -r requirements.txt
pip install opencv-python

# 4. Run the Flask server
python app.py
```

The server starts on `http://127.0.0.1:5000`.

---

## 📡 Endpoints

### 1. `GET /health`
Returns readiness status of the X-ray quality gate and multitask deep learning model.

### 2. `POST /predict`
- **Request**: `multipart/form-data` with key `image` containing a chest X-ray file.
- **Response**:
```json
{
  "xray_confirmed": true,
  "message": "X-ray image analyzed successfully",
  "multiclass": "tuberculosis",
  "prediction": "tuberculosis",
  "confidence": 0.942,
  "segmentation_overlay": "data:image/png;base64,...",
  "gradcam_overlay": "data:image/png;base64,...",
  "model_used": "multitask_tf_keras"
}
```

### 3. `POST /cleanup_files`
Cleans up temporary uploaded images and generated static files.
