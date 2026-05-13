@echo off
cd /d "%~dp0"
echo Starting backend installation...

python -m venv venv
if ERRORLEVEL 1 (
    echo "Python venv creation failed. Is Python installed and in PATH?"
    exit /b 1
)

call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
echo "Backend installation finished."
