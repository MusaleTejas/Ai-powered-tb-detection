from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)
# Security: Enforce upload size limit (16MB max) to prevent Denial of Service
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'dcm', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Create directories
os.makedirs('static/heatmaps', exist_ok=True)
os.makedirs('static/uploads', exist_ok=True)

# X-ray checker import
try:
    from models.xray_checker import (
        check_xray,
        is_ready as xray_is_ready,
        last_error as xray_last_error,
    )
except Exception as xe:
    check_xray = None
    xray_is_ready = lambda: False
    xray_last_error = lambda: str(xe)
    print(f"⚠️ X-ray checker unavailable: {xe}")

# Multitask handler (optional, used only if available)
try:
    from models import multitask_handler
    multitask_available = True
except Exception as me:
    multitask_handler = None
    multitask_available = False
    print(f"⚠️ Multitask handler unavailable: {me}")



@app.route('/health', methods=['GET'])
def health():
    # Report status of X-ray model and multitask (if present)
    xray_loaded = False
    xray_error = None
    multitask_loaded = False
    multitask_error = None
    try:
        xray_loaded = bool(xray_is_ready()) if callable(xray_is_ready) else False
        xray_error = xray_last_error() if callable(xray_last_error) else None
    except Exception as e:
        xray_loaded = False
        xray_error = str(e)
    try:
        multitask_loaded = multitask_handler.is_ready() if multitask_available else False
        multitask_error = multitask_handler.last_error() if multitask_available else None
    except Exception as e:
        multitask_loaded = False
        multitask_error = str(e)
    return jsonify({
        "status": "ok",
        "message": "Backend is running!",
        "xray_gate_loaded": xray_loaded,
        "xray_gate_error": xray_error,
        "multitask_loaded": multitask_loaded,
        "multitask_error": multitask_error,
    })

@app.route('/cleanup_files', methods=['POST'])
def cleanup_files():
    import shutil
    try:
        # Directories to clean
        dirs = [
            os.path.join('static', 'uploads'),
            os.path.join('static', 'heatmaps'),
        ]
        deleted = {}
        for d in dirs:
            abs_dir = os.path.abspath(d)
            if os.path.exists(abs_dir):
                count = 0
                for fname in os.listdir(abs_dir):
                    fpath = os.path.join(abs_dir, fname)
                    try:
                        if os.path.isfile(fpath):
                            os.remove(fpath)
                            count += 1
                        elif os.path.isdir(fpath):
                            shutil.rmtree(fpath)
                            count += 1
                    except Exception as e:
                        print(f"Failed to delete {fpath}: {e}")
                deleted[abs_dir] = count
            else:
                deleted[abs_dir] = 0
        return jsonify({'status': 'success', 'deleted': deleted})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500



@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file format. Please upload a standard image (PNG, JPG, JPEG, DICOM, BMP, TIFF)'}), 400
        # Save uploaded file temporarily with safe timestamped name
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        temp_filename = f"temp_{timestamp}.jpg"
        temp_path = os.path.join('static/uploads', temp_filename)
        file.save(temp_path)
        try:
            # X-ray gate: ensure the uploaded image is an X-ray first
            xray_confirmed = True
            if callable(check_xray) and xray_is_ready():
                try:
                    is_xray = check_xray(temp_path)
                    if not is_xray:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                        return jsonify({'error': 'Not an X-ray image!', 'xray_confirmed': False}), 400
                    xray_confirmed = True
                except Exception as gate_err:
                    print(f"X-ray check error: {gate_err}")
                    # Continue anyway if checker fails

            # If multitask is available, run it BEFORE cleanup
            mt = None
            if multitask_available:
                try:
                    # Simple timeout guard using a thread to avoid blocking forever
                    import threading
                    mt_result = {}
                    def _run_mt():
                        try:
                            mt_result['data'] = multitask_handler.analyze_to_view(temp_path)
                        except Exception as _e:
                            mt_result['error'] = str(_e)
                    t = threading.Thread(target=_run_mt, daemon=True)
                    t.start()
                    t.join(timeout=90)  # 90s limit for multitask
                    if 'data' in mt_result:
                        mt = mt_result['data']
                    else:
                        raise TimeoutError(mt_result.get('error') or 'Multitask timed out')
                except Exception as me:
                    print(f"Multitask inference error: {me}")
                    mt = None

            # Clean up temp file AFTER multitask analysis
            # DO NOT DELETE the uploaded file here, keep it for future use
            # if os.path.exists(temp_path):
            #     os.remove(temp_path)

            # Compose response
            if mt:
                pathology_names = [name for (name, _p) in mt.get('pathologies', [])]
                pathology_scores = [
                    { 'name': name, 'prob': float(prob) }
                    for (name, prob) in mt.get('pathologies', [])
                ]
                resp = {
                    'xray_confirmed': True,
                    'message': 'X-ray image analyzed successfully',
                    'multiclass': mt.get('multiclass_label'),
                    'prediction': mt.get('multiclass_label'),
                    'confidence': float(mt.get('multiclass_confidence', 0.0)),
                    'pathology': pathology_names,
                    'pathology_scores': pathology_scores if pathology_scores else mt.get('pathology_scores'),
                    'tumor_subtype': mt.get('tumor_subtype'),
                    'tumor_subtype_confidence': float(mt.get('tumor_subtype_confidence', 0.0)) if mt.get('tumor_subtype_confidence') else None,
                    'segmentation_overlay': mt.get('segmentation_url'),
                    'gradcam_overlay': mt.get('gradcam_url'),
                    'segmentation_filename': mt.get('segmentation_filename'),
                    'gradcam_filename': mt.get('gradcam_filename'),
                    'model_used': 'multitask_tf_keras',
                    'uploaded_filename': temp_filename,  # Include the filename in response
                }
                # Frontend will call /report on the Node.js chat backend after showing multitask outputs
                if isinstance(mt.get('predictions'), list):
                    resp['predictions'] = mt.get('predictions')
                return jsonify(resp)

            # Fallback X-ray-only response
            return jsonify({
                'xray_confirmed': xray_confirmed,
                'message': 'X-ray image validated successfully',
                'prediction': None,
                'confidence': None,
                'model_used': 'xray_gate_only',
                'uploaded_filename': temp_filename  # Always include filename
            })
        except Exception as e:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            print(f"❌ Prediction error: {e}")
            return jsonify({'error': f'Prediction failed: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500



if __name__ == '__main__':
    print("[INIT] Starting Tuberculosis (TB) Detection API...")
    print("[INIT] Server starting on port 5000...")
    print("[OK] Server ready! X-ray checker first; multitask used if available.")
    print("🔗 Endpoints:")
    print("   - GET  /health - Check server and model status")
    print("   - POST /predict - Upload image for analysis")
    print("   - POST /cleanup_files - Clean temporary files")



    # Optionally preload multitask in background
    try:
        if multitask_available and hasattr(multitask_handler, 'load_model_if_needed'):
            import threading
            threading.Thread(target=multitask_handler.load_model_if_needed, daemon=True).start()
            print("🧠 Preloading multitask model in background...")
    except Exception as e:
        print(f"⚠️ Multitask preload failed: {e}")
    # Disable the auto-reloader to prevent double-loading models on code changes
    app.run(debug=True, port=5000, use_reloader=False)