# Installation Guide

This guide will help you set up the Esophageal Abnormality Detection System on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python 3.7 or higher** ([Download Python](https://www.python.org/downloads/))
- **pip** (Python package installer - comes with Python)
- **Git** ([Download Git](https://git-scm.com/downloads))
- **Virtual Environment** (recommended)

### System Requirements

- **RAM**: Minimum 8GB (16GB recommended for model training)
- **Storage**: At least 5GB free space
- **OS**: Windows 10+, macOS 10.14+, or Ubuntu 18.04+

## 🚀 Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System.git
cd Esophageal-Abnormality-Detection-System
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
# Install all required packages
pip install -r requirements.txt
```

### 4. Set Up the Web Application

```bash
# Navigate to web application directory
cd 2webapp

# Initialize the database
python database.py

# Run the application
python app.py
```

### 5. Access the Application

Open your web browser and navigate to: `http://localhost:5000`

## 🔧 Detailed Installation

### Step 1: Environment Setup

#### Windows

```powershell
# Install Python from python.org
# Open Command Prompt or PowerShell

# Verify Python installation
python --version
pip --version

# Clone repository
git clone https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System.git
cd Esophageal-Abnormality-Detection-System

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate
```

#### macOS

```bash
# Install Python using Homebrew (recommended)
brew install python

# Or download from python.org

# Clone repository
git clone https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System.git
cd Esophageal-Abnormality-Detection-System

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate
```

#### Ubuntu/Linux

```bash
# Update package list
sudo apt update

# Install Python and pip
sudo apt install python3 python3-pip python3-venv git

# Clone repository
git clone https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System.git
cd Esophageal-Abnormality-Detection-System

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
# Upgrade pip first
pip install --upgrade pip

# Install project dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

### Step 3: Database Setup

```bash
# Navigate to webapp directory
cd 2webapp

# Initialize the SQLite database
python database.py

# Verify database creation
ls -la esophai.db  # On Linux/macOS
dir esophai.db     # On Windows
```

### Step 4: Model Setup

Ensure the trained model file is available:

```bash
# The model file should be in the 2webapp directory
# If missing, you may need to train the model first
ls -la Esophageal_model.h5  # Check if model exists
```

## 🧪 Development Installation

For development work, install additional dependencies:

```bash
# Install development dependencies
pip install pytest pytest-flask black flake8 jupyter

# Install pre-commit hooks (optional)
pip install pre-commit
pre-commit install
```

## 🐳 Docker Installation (Alternative)

If you prefer using Docker:

```bash
# Build Docker image
docker build -t esophageal-detection .

# Run container
docker run -p 5000:5000 esophageal-detection
```

## ⚠️ Troubleshooting

### Common Issues

#### 1. Python Version Issues

```bash
# Check Python version
python --version

# If you have multiple Python versions, use:
python3.8 -m venv venv  # Replace 3.8 with your version
```

#### 2. TensorFlow Installation Issues

```bash
# For CPU-only TensorFlow
pip install tensorflow-cpu

# For GPU support (requires CUDA)
pip install tensorflow-gpu
```

#### 3. Permission Issues (Linux/macOS)

```bash
# Add user permissions
sudo chown -R $USER:$USER /path/to/project
```

#### 4. Port Already in Use

```bash
# Kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Linux/macOS:
lsof -ti:5000 | xargs kill -9
```

#### 5. Virtual Environment Issues

```bash
# Remove existing venv and recreate
rm -rf venv  # Linux/macOS
rmdir /s venv  # Windows

# Recreate virtual environment
python -m venv venv
```

### Memory Issues

If you encounter memory issues during installation or runtime:

```bash
# Install with no cache
pip install --no-cache-dir -r requirements.txt

# For systems with limited RAM, install packages one by one
pip install flask
pip install tensorflow-cpu  # Instead of full tensorflow
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# .env file
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_PATH=2webapp/esophai.db
MODEL_PATH=2webapp/Esophageal_model.h5
```

### Custom Configuration

Edit the configuration in `2webapp/app.py`:

```python
# Custom upload folder
UPLOAD_FOLDER = 'custom/path/to/uploads'

# Custom model path
MODEL_PATH = 'path/to/your/model.h5'

# Custom secret key
app.secret_key = 'your-custom-secret-key'
```

## ✅ Verification

To verify your installation:

```bash
# 1. Check Python packages
pip list | grep -E "(flask|tensorflow|numpy)"

# 2. Test database connection
cd 2webapp
python -c "from database import init_db; init_db(); print('Database OK')"

# 3. Test model loading
python -c "from tensorflow.keras.models import load_model; load_model('Esophageal_model.h5'); print('Model OK')"

# 4. Run application
python app.py
```

## 🚀 Next Steps

After successful installation:

1. **Read the User Guide**: `docs/USER_GUIDE.md`
2. **Check API Documentation**: `docs/API.md`
3. **Review Contributing Guidelines**: `CONTRIBUTING.md`
4. **Run Tests**: `pytest tests/`

## 📞 Support

If you encounter issues during installation:

1. Check the [Issues](https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System/issues) page
2. Search for similar installation problems
3. Create a new issue with:
   - Your operating system
   - Python version
   - Complete error message
   - Steps you've already tried

---

**Happy coding!** 🎉