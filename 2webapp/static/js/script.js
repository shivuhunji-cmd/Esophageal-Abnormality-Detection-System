// Enhanced JavaScript for Esophageal Detection System
// Modern, clean, and feature-rich interactions

class EsophagealDetectionApp {
  constructor() {
      this.fileInput = null;
      this.uploadArea = null;
      this.previewContainer = null;
      this.previewImage = null;
      this.predictBtn = null;
      this.form = null;
      this.currentFile = null;
      
      this.maxFileSize = 10 * 1024 * 1024; // 10MB
      this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
      
      this.init();
  }
  
  init() {
      this.bindElements();
      this.attachEventListeners();
      this.setupValidation();
  }
  
  bindElements() {
      this.fileInput = document.getElementById('fileInput') || document.getElementById('file-ip-1');
      this.uploadArea = document.getElementById('uploadArea');
      this.previewContainer = document.getElementById('previewContainer');
      this.previewImage = document.getElementById('previewImage') || document.getElementById('file-ip-1-preview');
      this.predictBtn = document.getElementById('predictBtn') || document.getElementById('thebutton');
      this.form = document.getElementById('uploadForm') || document.getElementById('myform');
  }
  
  attachEventListeners() {
      if (this.fileInput) {
          this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
      }
      
      if (this.uploadArea) {
          this.uploadArea.addEventListener('click', () => this.triggerFileInput());
          this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
          this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
          this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
      }
      
      if (this.form) {
          this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
      }
      
      // Global error handling
      window.addEventListener('error', (e) => this.handleGlobalError(e));
  }
  
  setupValidation() {
      // Real-time form validation
      if (this.fileInput) {
          this.fileInput.addEventListener('change', () => this.validateFile());
      }
  }
  
  triggerFileInput() {
      if (this.fileInput) {
          this.fileInput.click();
      }
  }
  
  handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
          this.processFile(file);
      }
  }
  
  handleDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.uploadArea) {
          this.uploadArea.classList.add('dragover');
      }
  }
  
  handleDragLeave(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.uploadArea) {
          this.uploadArea.classList.remove('dragover');
      }
  }
  
  handleDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      
      if (this.uploadArea) {
          this.uploadArea.classList.remove('dragover');
      }
      
      const files = event.dataTransfer.files;
      if (files.length > 0) {
          this.processFile(files[0]);
          if (this.fileInput) {
              this.fileInput.files = files;
          }
      }
  }
  
  processFile(file) {
      this.currentFile = file;
      
      // Validate file
      const validation = this.validateFileObject(file);
      if (!validation.isValid) {
          this.showError(validation.message);
          return;
      }
      
      // Show success message
      this.showSuccess('File loaded successfully! Ready for analysis.');
      
      // Display preview
      this.displayPreview(file);
      
      // Update file information
      this.updateFileInfo(file);
      
      // Enable prediction button
      this.enablePredictButton();
  }
  
  validateFile() {
      if (!this.fileInput || !this.fileInput.files[0]) {
          return false;
      }
      
      const file = this.fileInput.files[0];
      const validation = this.validateFileObject(file);
      
      if (!validation.isValid) {
          this.showError(validation.message);
          return false;
      }
      
      return true;
  }
  
  validateFileObject(file) {
      // Check file type
      if (!this.allowedTypes.includes(file.type)) {
          return {
              isValid: false,
              message: 'Please select a valid image file (JPEG, PNG, GIF, or BMP).'
          };
      }
      
      // Check file size
      if (file.size > this.maxFileSize) {
          return {
              isValid: false,
              message: `File size must be less than ${this.formatFileSize(this.maxFileSize)}.`
          };
      }
      
      // Check for minimum dimensions (if needed)
      return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
              if (img.width < 100 || img.height < 100) {
                  resolve({
                      isValid: false,
                      message: 'Image must be at least 100x100 pixels.'
                  });
              } else {
                  resolve({ isValid: true });
              }
          };
          img.onerror = () => {
              resolve({
                  isValid: false,
                  message: 'Unable to process this image file.'
              });
          };
          img.src = URL.createObjectURL(file);
      });
  }
  
  displayPreview(file) {
      if (!this.previewImage) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
          this.previewImage.src = e.target.result;
          this.previewImage.style.display = 'block';
          
          if (this.previewContainer) {
              this.previewContainer.style.display = 'block';
              this.previewContainer.classList.add('animate-fadeIn');
          }
      };
      reader.onerror = () => {
          this.showError('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
  }
  
  updateFileInfo(file) {
      const elements = {
          fileName: document.getElementById('fileName'),
          fileSize: document.getElementById('fileSize'),
          fileType: document.getElementById('fileType')
      };
      
      if (elements.fileName) {
          elements.fileName.textContent = file.name;
      }
      if (elements.fileSize) {
          elements.fileSize.textContent = this.formatFileSize(file.size);
      }
      if (elements.fileType) {
          elements.fileType.textContent = file.type;
      }
  }
  
  enablePredictButton() {
      if (this.predictBtn) {
          this.predictBtn.style.display = 'block';
          this.predictBtn.disabled = false;
          this.predictBtn.classList.remove('loading');
      }
  }
  
  handleFormSubmit(event) {
      if (!this.validateFile()) {
          event.preventDefault();
          return false;
      }
      
      this.showLoadingState();
      
      // Let form submit naturally to Flask backend
      return true;
  }
  
  showLoadingState() {
      if (this.predictBtn) {
          this.predictBtn.classList.add('loading');
          this.predictBtn.disabled = true;
          
          const spinner = this.predictBtn.querySelector('.loading-spinner');
          const btnText = this.predictBtn.querySelector('#btnText');
          
          if (spinner) spinner.style.display = 'inline-block';
          if (btnText) btnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
      }
      
      // Show progress indicator
      this.showProgress();
  }
  
  showProgress() {
      // Create or update progress bar
      let progressBar = document.querySelector('.upload-progress');
      if (!progressBar) {
          progressBar = document.createElement('div');
          progressBar.className = 'upload-progress';
          progressBar.innerHTML = `
              <div class="progress">
                  <div class="progress-bar" style="width: 0%"></div>
              </div>
              <div class="progress-text">Uploading and analyzing...</div>
          `;
          
          if (this.form) {
              this.form.appendChild(progressBar);
          }
      }
      
      // Animate progress
      const bar = progressBar.querySelector('.progress-bar');
      if (bar) {
          let width = 0;
          const interval = setInterval(() => {
              width += Math.random() * 15;
              if (width >= 90) {
                  width = 90;
                  clearInterval(interval);
              }
              bar.style.width = width + '%';
          }, 200);
      }
  }
  
  showError(message) {
      this.showMessage(message, 'error');
  }
  
  showSuccess(message) {
      this.showMessage(message, 'success');
  }
  
  showMessage(message, type = 'info') {
      // Remove existing messages
      const existingMessages = document.querySelectorAll('.alert-message');
      existingMessages.forEach(msg => msg.remove());
      
      // Create new message
      const messageEl = document.createElement('div');
      messageEl.className = `alert-message alert-${type} animate-fadeIn`;
      messageEl.innerHTML = `
          <div class="alert-content">
              <i class="fas fa-${this.getIconForType(type)}"></i>
              <span>${message}</span>
              <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                  <i class="fas fa-times"></i>
              </button>
          </div>
      `;
      
      // Add styles
      messageEl.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 400px;
          animation: slideIn 0.3s ease-out;
      `;
      
      // Set background based on type
      const colors = {
          error: { bg: '#fed7d7', color: '#c53030', border: '#f56565' },
          success: { bg: '#c6f6d5', color: '#2f855a', border: '#48bb78' },
          warning: { bg: '#faf089', color: '#744210', border: '#ecc94b' },
          info: { bg: '#bee3f8', color: '#2a69ac', border: '#4299e1' }
      };
      
      const colorScheme = colors[type] || colors.info;
      messageEl.style.backgroundColor = colorScheme.bg;
      messageEl.style.color = colorScheme.color;
      messageEl.style.borderLeft = `4px solid ${colorScheme.border}`;
      
      document.body.appendChild(messageEl);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
          if (messageEl.parentNode) {
              messageEl.remove();
          }
      }, 5000);
  }
  
  getIconForType(type) {
      const icons = {
          error: 'exclamation-circle',
          success: 'check-circle',
          warning: 'exclamation-triangle',
          info: 'info-circle'
      };
      return icons[type] || icons.info;
  }
  
  formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  handleGlobalError(event) {
      console.error('Global error:', event.error);
      this.showError('An unexpected error occurred. Please try again.');
  }
  
  // Utility methods for backwards compatibility
  showPreview(event) {
      this.handleFileSelect(event);
  }
  
  showDiv() {
      this.enablePredictButton();
  }
}

// Results page functionality
class ResultsPage {
  constructor() {
      this.init();
  }
  
  init() {
      this.setCurrentDate();
      this.setPredictionStatus();
      this.setupInteractions();
      this.animateElements();
  }
  
  setCurrentDate() {
      const dateElement = document.getElementById('analysisDate');
      if (dateElement) {
          dateElement.textContent = new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
          });
      }
  }
  
  setPredictionStatus() {
      const predictionCard = document.getElementById('predictionCard');
      const predictionLabel = document.getElementById('predictionLabel');
      const confidenceElement = document.getElementById('predictionConfidence');
      
      if (!predictionCard || !predictionLabel) return;
      
      const predictionText = predictionLabel.textContent.toLowerCase();
      const confidenceMatch = confidenceElement ? confidenceElement.textContent.match(/\d+\.?\d*/) : null;
      const confidence = confidenceMatch ? parseFloat(confidenceMatch[0]) : 0;
      
      // Apply status-based styling
      if (predictionText.includes('normal') || predictionText.includes('healthy')) {
          predictionCard.classList.add('status-normal');
      } else if (confidence < 70) {
          predictionCard.classList.add('status-uncertain');
      } else {
          predictionCard.classList.add('status-abnormal');
      }
      
      // Animate confidence bar
      const confidenceFill = document.getElementById('confidenceFill');
      if (confidenceFill) {
          setTimeout(() => {
              confidenceFill.style.width = confidence + '%';
          }, 500);
      }
  }
  
  setupInteractions() {
      // Add hover effects to detail cards
      const detailCards = document.querySelectorAll('.detail-card');
      detailCards.forEach(card => {
          card.addEventListener('mouseenter', function() {
              this.style.transform = 'translateY(-5px) scale(1.02)';
              this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
          });
          
          card.addEventListener('mouseleave', function() {
              this.style.transform = 'translateY(0) scale(1)';
              this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          });
      });
      
      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                  target.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                  });
              }
          });
      });
  }
  
  animateElements() {
      // Stagger animation for elements
      const animatedElements = document.querySelectorAll('.detail-card, .prediction-card');
      animatedElements.forEach((element, index) => {
          element.style.opacity = '0';
          element.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
              element.style.transition = 'all 0.6s ease-out';
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
          }, index * 100);
      });
  }
  
  downloadReport() {
      const predictionLabel = document.getElementById('predictionLabel');
      const predictionConfidence = document.getElementById('predictionConfidence');
      const analysisDate = document.getElementById('analysisDate');
      
      const reportData = {
          prediction: predictionLabel ? predictionLabel.textContent : 'Unknown',
          confidence: predictionConfidence ? predictionConfidence.textContent : 'Unknown',
          date: analysisDate ? analysisDate.textContent : new Date().toLocaleDateString(),
          model: 'EsophAI v2.1.0',
          timestamp: new Date().toISOString()
      };
      
      const reportContent = this.generateReportContent(reportData);
      this.downloadFile(reportContent, `esophageal-analysis-${Date.now()}.txt`, 'text/plain');
      
      // Show success message
      this.showToast('Report downloaded successfully!', 'success');
  }
  
  generateReportContent(data) {
      return `
ESOPHAGEAL DISEASE DETECTION REPORT
====================================

Analysis Information:
--------------------
Date: ${data.date}
Model Version: ${data.model}
Report Generated: ${new Date(data.timestamp).toLocaleString()}

Results:
--------
Prediction: ${data.prediction}
${data.confidence}

Technical Details:
------------------
Processing Method: Convolutional Neural Network (CNN)
Image Processing: Automated preprocessing with standardization
Analysis Time: < 3 seconds

Interpretation Guidelines:
--------------------------
- High confidence (>90%): Strong indication of the predicted condition
- Medium confidence (70-90%): Moderate indication, consider additional testing
- Low confidence (<70%): Uncertain result, professional review recommended

IMPORTANT MEDICAL DISCLAIMER:
=============================
This AI analysis is for research and educational purposes only. 
Results should not be used as a substitute for professional medical 
diagnosis or treatment. The system is designed to assist healthcare 
professionals and should not replace clinical judgment.

Always consult with qualified healthcare professionals for:
- Medical diagnosis and treatment decisions
- Interpretation of medical imaging results
- Patient care and management
- Clinical decision making

Recommendations:
----------------
1. Review results with a qualified healthcare professional
2. Consider additional diagnostic tests if clinically indicated
3. Follow standard medical protocols for patient care
4. Document findings in patient medical records appropriately

Generated by EsophAI - Advanced Medical Image Analysis System
For technical support or questions, contact: support@esophai.medical
      `.trim();
  }
  
  shareResults() {
      const predictionLabel = document.getElementById('predictionLabel');
      const predictionConfidence = document.getElementById('predictionConfidence');
      
      const shareText = `EsophAI Analysis Results: ${predictionLabel ? predictionLabel.textContent : 'Analysis complete'} with ${predictionConfidence ? predictionConfidence.textContent : 'confidence reported'}`;
      
      if (navigator.share) {
          navigator.share({
              title: 'EsophAI Analysis Results',
              text: shareText,
              url: window.location.href
          }).then(() => {
              this.showToast('Results shared successfully!', 'success');
          }).catch(() => {
              this.fallbackShare(shareText);
          });
      } else {
          this.fallbackShare(shareText);
      }
  }
  
  fallbackShare(text) {
      if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
              this.showToast('Results copied to clipboard!', 'success');
          }).catch(() => {
              this.showToast('Unable to copy results. Please try again.', 'error');
          });
      } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          try {
              document.execCommand('copy');
              this.showToast('Results copied to clipboard!', 'success');
          } catch (err) {
              this.showToast('Unable to copy results. Please try again.', 'error');
          }
          document.body.removeChild(textArea);
      }
  }
  
  downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  }
  
  showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
          <div class="toast-content">
              <i class="fas fa-${this.getToastIcon(type)}"></i>
              <span>${message}</span>
          </div>
      `;
      
      // Toast styles
      toast.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 300px;
          animation: slideInUp 0.3s ease-out;
      `;
      
      // Set colors based on type
      const colors = {
          success: { bg: '#48bb78', color: 'white' },
          error: { bg: '#f56565', color: 'white' },
          warning: { bg: '#ed8936', color: 'white' },
          info: { bg: '#4299e1', color: 'white' }
      };
      
      const colorScheme = colors[type] || colors.info;
      toast.style.backgroundColor = colorScheme.bg;
      toast.style.color = colorScheme.color;
      
      document.body.appendChild(toast);
      
      // Remove after 3 seconds
      setTimeout(() => {
          toast.style.animation = 'slideOutDown 0.3s ease-out';
          setTimeout(() => {
              if (toast.parentNode) {
                  toast.remove();
              }
          }, 300);
      }, 3000);
  }
  
  getToastIcon(type) {
      const icons = {
          success: 'check',
          error: 'exclamation-circle',
          warning: 'exclamation-triangle',
          info: 'info-circle'
      };
      return icons[type] || icons.info;
  }
}

// Utility functions for global use
const Utils = {
  formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  },
  
  debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  },
  
  throttle(func, limit) {
      let inThrottle;
      return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
              func.apply(context, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
          }
      }
  }
};

// Initialize appropriate class based on page
document.addEventListener('DOMContentLoaded', function() {
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
      @keyframes slideInUp {
          from {
              transform: translateY(100%);
              opacity: 0;
          }
          to {
              transform: translateY(0);
              opacity: 1;
          }
      }
      
      @keyframes slideOutDown {
          from {
              transform: translateY(0);
              opacity: 1;
          }
          to {
              transform: translateY(100%);
              opacity: 0;
          }
      }
      
      @keyframes slideIn {
          from {
              transform: translateX(100%);
              opacity: 0;
          }
          to {
              transform: translateX(0);
              opacity: 1;
          }
      }
  `;
  document.head.appendChild(style);
  
  // Initialize based on page content
  if (document.getElementById('uploadForm') || document.getElementById('myform')) {
      // Home page - initialize upload functionality
      window.esophApp = new EsophagealDetectionApp();
  } else if (document.querySelector('.prediction-card') || document.querySelector('.results-section')) {
      // Results page - initialize results functionality
      window.resultsPage = new ResultsPage();
  }
});

// Global functions for backwards compatibility and template usage
function showPreview(event) {
  if (window.esophApp) {
      window.esophApp.showPreview(event);
  }
}

function showDiv() {
  if (window.esophApp) {
      window.esophApp.showDiv();
  }
}

function downloadReport() {
  if (window.resultsPage) {
      window.resultsPage.downloadReport();
  }
}

function shareResults() {
  if (window.resultsPage) {
      window.resultsPage.shareResults();
  }
}

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
      EsophagealDetectionApp,
      ResultsPage,
      Utils
  };
}