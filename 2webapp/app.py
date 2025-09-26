import os
import uuid
import numpy as np
from flask import Flask, flash, request, redirect, url_for, render_template, send_from_directory
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load the pre-trained model
model = load_model("Esophageal_model.h5")

# Configuration
UPLOAD_FOLDER = 'static/img'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'supersecretkey'  # Required for flashing messages

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Home Page
@app.route('/')
def index():
    return render_template('analyze.html')

# Prediction Route
@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(url_for('index'))

    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('index'))

    if file and allowed_file(file.filename):
        unique_filename = "temp" + uuid.uuid4().hex + ".jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)

        # Preprocess image
        test_image = image.load_img(filepath, target_size=(224, 224))
        test_image = image.img_to_array(test_image)
        test_image = np.expand_dims(test_image, axis=0)
        test_image = test_image.astype('float32') / 255.0

        # Prediction
        result = model.predict(test_image)
        pred_prob = result.item()

        if pred_prob > 0.5:
            label = 'Esophageal Cancer'
            accuracy = round(pred_prob * 100, 2)
        else:
            label = 'Non-Esophageal Cancer'
            accuracy = round((1 - pred_prob) * 100, 2)

        return render_template('results.html',
                               label=label,
                               accuracy=accuracy,
                               image_file_name=unique_filename)

    flash('Invalid file type')
    return redirect(url_for('results'))

# Serve uploaded image
@app.route('/upload/<filename>')
def send_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
