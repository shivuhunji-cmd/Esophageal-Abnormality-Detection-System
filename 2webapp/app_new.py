import os
import uuid
import numpy as np
from flask import Flask, flash, request, redirect, url_for, render_template, send_from_directory, session
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db, get_user_by_username, create_user, get_user_by_id, save_analysis, get_user_analyses, get_user_stats, get_admin_stats

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

# Initialize database
init_db()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Home Page
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username_or_email']
        password = request.form['password']
        
        user = get_user_by_username(username)
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            flash('Logged in successfully', 'success')
            return redirect(url_for('dashboard'))
        
        flash('Invalid username or password', 'error')
        return redirect(url_for('login'))
    
    return render_template('auth/login.html')

# Register Route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        first_name = request.form.get('first_name', '')
        last_name = request.form.get('last_name', '')
        
        if get_user_by_username(username):
            flash('Username already exists', 'error')
            return redirect(url_for('register'))
        
        password_hash = generate_password_hash(password)
        create_user(username, email, password_hash, first_name, last_name)
        
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('auth/register.html')

# Dashboard Route
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('Please log in to access the dashboard', 'error')
        return redirect(url_for('login'))
    
    user = get_user_by_id(session['user_id'])
    recent_analyses = get_user_analyses(session['user_id'])
    user_stats = get_user_stats(session['user_id'])
    admin_stats = None
    if user['role'] == 'admin':
        admin_stats = get_admin_stats()
    
    return render_template('dashboard/dashboard_fixed.html',
                           current_user=user,
                           recent_analyses=recent_analyses,
                           total_analyses=user_stats['total_analyses'],
                           admin_stats=admin_stats)

# Logout Route
@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

# Analyze Route
@app.route('/analyze')
def analyze():
    if 'user_id' not in session:
        flash('Please log in to access analysis', 'error')
        return redirect(url_for('login'))
    
    return render_template('analyze.html')

# Prediction Route
@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'user_id' not in session:
        flash('Please log in to upload files', 'error')
        return redirect(url_for('login'))

    if 'file' not in request.files:
        flash('No file part', 'error')
        return redirect(url_for('analyze'))

    file = request.files['file']
    if file.filename == '':
        flash('No selected file', 'error')
        return redirect(url_for('analyze'))

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

        # Save analysis to database
        save_analysis(session['user_id'], file.filename, label, accuracy, unique_filename)

        return render_template('results.html',
                               label=label,
                               accuracy=accuracy,
                               image_file_name=unique_filename)

    flash('Invalid file type', 'error')
    return redirect(url_for('analyze'))

# Serve uploaded image
@app.route('/upload/<filename>')
def send_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
