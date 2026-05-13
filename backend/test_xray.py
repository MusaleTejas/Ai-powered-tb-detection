import sys
import os

# Add backend directory to sys.path to allow imports like "from models.xray_checker..."
backend_dir = r"c:\Users\sp711\Downloads\TB care\backend"
sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

try:
    from models.xray_checker import check_xray, is_ready, last_error
    print("Imports successful")
    
    ready = is_ready()
    print(f"Is ready? {ready}")
    
    error = last_error()
    if error:
        print(f"Last error: {error}")
    else:
        print("No error recorded. This implies the model loaded successfully.")

except Exception as e:
    print(f"Import failed: {e}")
