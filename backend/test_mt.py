import sys
import os
import traceback

backend_dir = r"c:\Users\sp711\Downloads\TB care\backend"
sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

def test_mt():
    try:
        from models import multitask_handler
        print("Import successful!")
        
        # Test finding model
        model_path = multitask_handler._find_model_path()
        print(f"Model path found: {model_path}")
        
        # Test loading model
        multitask_handler.load_model_if_needed()
        print(f"Is ready? {multitask_handler.is_ready()}")
        print(f"Last error: {multitask_handler.last_error()}")
        
        # create a dummy image to test analyze_to_view
        import numpy as np
        import cv2
        img = np.zeros((384, 384, 3), dtype=np.uint8)
        cv2.imwrite("dummy_test.jpg", img)
        print("Created dummy image")
        
        result = multitask_handler.analyze_to_view("dummy_test.jpg")
        print("analyze_to_view successful!")
        print("Result keys:", result.keys())
        
    except Exception as e:
        print("Exception occurred!")
        traceback.print_exc()

if __name__ == "__main__":
    with open("mt_debug.log", "w") as f:
        sys.stdout = f
        sys.stderr = f
        test_mt()
