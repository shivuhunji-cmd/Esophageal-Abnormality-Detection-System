# Esophageal Abnormality Detection System

[![Python](https://img.shields.io/badge/Python-3.7%2B-blue.svg)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://tensorflow.org/)
[![Flask](https://img.shields.io/badge/Flask-2.x-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A deep learning-powered web application for detecting esophageal abnormalities in medical images. This system uses advanced computer vision techniques to assist healthcare professionals in the early detection and diagnosis of esophageal conditions.

## 🎯 Overview

The Esophageal Abnormality Detection System is designed to:
- **Analyze medical images** for potential esophageal abnormalities
- **Provide real-time predictions** with confidence scores
- **Support medical professionals** in diagnostic decision-making
- **Maintain patient data security** with robust authentication

## ✨ Features

- **🔬 AI-Powered Detection**: Advanced deep learning model trained on medical imaging data
- **🌐 Web Interface**: User-friendly Flask-based web application
- **👤 User Authentication**: Secure login system with role-based access
- **📊 Analytics Dashboard**: Track analysis history and statistics
- **🖼️ Multiple Image Formats**: Support for PNG, JPG, JPEG, and GIF files
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🔒 Data Security**: Secure file handling and user data protection

## 🏗️ Project Structure

```
├── 2webapp/                    # Main web application
│   ├── app.py                 # Main Flask application
│   ├── database.py            # Database operations
│   ├── static/                # CSS, JS, and uploaded images
│   │   ├── css/              # Stylesheets
│   │   ├── js/               # JavaScript files
│   │   └── img/              # Uploaded and processed images
│   ├── templates/             # HTML templates
│   │   ├── analyze.html      # Main analysis page
│   │   ├── results.html      # Results display
│   │   └── auth/             # Authentication pages
│   └── requirements.txt       # Web app dependencies
├── dataset/                   # Training and testing datasets
│   ├── TRAIN/                # Training data
│   │   ├── esophageal/       # Abnormal cases
│   │   └── nonesophageal/    # Normal cases
│   └── TEST/                 # Testing data
├── data/                      # Additional data files
├── surgical_video_frames/     # Processed video frames
├── *.py                      # Model training and utility scripts
└── *.ipynb                   # Jupyter notebooks for analysis
```

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip package manager
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System.git
   cd Esophageal-Abnormality-Detection-System
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv

   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Navigate to the web application**
   ```bash
   cd 2webapp
   ```

5. **Initialize the database**
   ```bash
   python database.py
   ```

6. **Run the application**
   ```bash
   python app.py
   ```

7. **Access the application**
   Open your browser and go to `http://localhost:5000`

## 🔧 Usage

### For Healthcare Professionals

1. **Register/Login**: Create an account or log in to access the system
2. **Upload Image**: Select and upload a medical image for analysis
3. **View Results**: Review the AI prediction with confidence scores
4. **Track History**: Access previous analyses and maintain patient records

### For Researchers/Developers

1. **Model Training**: Use the provided Jupyter notebooks to train custom models
2. **Data Processing**: Process surgical videos and extract frames for analysis
3. **API Integration**: Integrate the detection system into existing workflows

## 🧠 Model Architecture

The system uses a deep learning model based on:
- **Convolutional Neural Networks (CNN)** for image feature extraction
- **Transfer Learning** with pre-trained models (VGG16/ResNet)
- **Data Augmentation** for improved generalization
- **Binary Classification** for abnormality detection

### Model Performance
- Training Accuracy: ~95%
- Validation Accuracy: ~92%
- Input Size: 224×224 pixels
- Supported Formats: RGB images

## 📊 Dataset Information

The system is trained on a comprehensive dataset containing:
- **Training Set**: Balanced collection of normal and abnormal esophageal images
- **Test Set**: Independent validation data for performance evaluation
- **Data Sources**: Medical imaging from various healthcare institutions
- **Preprocessing**: Standardized image sizes, normalization, and augmentation

## 🔒 Security Features

- **User Authentication**: Secure login with password hashing
- **Session Management**: Protected user sessions
- **File Validation**: Safe file upload with type checking
- **Data Privacy**: Secure handling of medical images
- **Access Control**: Role-based permissions

## 🤝 Contributing

We welcome contributions from the medical AI community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code style and standards
- Submitting bug reports
- Proposing new features
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Medical Disclaimer

**IMPORTANT**: This system is designed to assist healthcare professionals and should not be used as the sole basis for medical diagnosis. Always consult with qualified medical professionals for proper diagnosis and treatment.

## 👨‍💻 Author

**Shivuhunji**
- GitHub: [@shivuhunji-cmd](https://github.com/shivuhunji-cmd)
- Project Link: [Esophageal Abnormality Detection System](https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System)

## 🙏 Acknowledgments

- Medical imaging research community
- TensorFlow and Keras developers
- Flask framework contributors
- Healthcare professionals who provided domain expertise

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer through GitHub

---

**Made with ❤️ for advancing medical AI and healthcare technology**