/**
 * Witness Chicago - Secure Civil Rights Reporting Platform
 * Client-side application with encryption, validation, and accessibility features
 */

// Application state and configuration
const WitnessApp = {
    // Configuration
    config: {
        maxFileSize: 10 * 1024 * 1024, // 10MB per file
        allowedFileTypes: [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/webm', 'video/quicktime',
            'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a',
            'application/pdf',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ],
        apiEndpoint: '/api/submit-report', // To be configured for production
        encryptionKeyId: 'witness-chicago-2025' // Public key identifier
    },

    // Application state
    state: {
        selectedFiles: [],
        isSubmitting: false,
        encryptionKey: null
    },

    // Initialize application
    init() {
        this.initializeEncryption();
        this.setupEventListeners();
        this.setupAccessibility();
        this.setupFormValidation();
        this.setupRealTimeValidation();
        this.setupConditionalFields();
        this.restoreFormData();
        this.setupFormPersistence();
        console.log('Witness Chicago application initialized');
    },

    // Set up form data persistence
    setupFormPersistence() {
        const form = document.getElementById('incident-form');
        
        // Save form data on every input change
        form.addEventListener('input', () => {
            this.saveFormData();
        });
        
        // Also save on change events (for checkboxes, radios, selects)
        form.addEventListener('change', () => {
            this.saveFormData();
        });
    },

    // Save current form data to localStorage
    saveFormData() {
        try {
            const form = document.getElementById('incident-form');
            const formData = new FormData(form);
            const data = {};

            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    // Handle multiple values (checkboxes)
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }

            // Save to localStorage
            localStorage.setItem('witness-chicago-form-data', JSON.stringify({
                data: data,
                timestamp: new Date().toISOString(),
                files: this.state.selectedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                    // Note: File content can't be saved to localStorage
                    // Files will need to be re-selected if page is refreshed
                }))
            }));
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    },

    // Restore form data from localStorage
    restoreFormData() {
        try {
            const savedData = localStorage.getItem('witness-chicago-form-data');
            if (!savedData) return;

            const { data, timestamp, files } = JSON.parse(savedData);
            const form = document.getElementById('incident-form');

            // Check if data is recent (within 24 hours)
            const saveTime = new Date(timestamp);
            const now = new Date();
            const hoursDiff = (now - saveTime) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                // Data is too old, clear it
                localStorage.removeItem('witness-chicago-form-data');
                return;
            }

            // Restore form fields
            Object.entries(data).forEach(([key, value]) => {
                const elements = form.querySelectorAll(`[name="${key}"]`);
                
                elements.forEach(element => {
                    if (element.type === 'checkbox' || element.type === 'radio') {
                        if (Array.isArray(value)) {
                            element.checked = value.includes(element.value);
                        } else {
                            element.checked = element.value === value;
                        }
                    } else {
                        element.value = value;
                    }
                });
            });

            // Show notification about restored data
            if (Object.keys(data).length > 0) {
                this.showFormRestoredNotification(timestamp);
            }

            // Restore conditional field states
            this.restoreConditionalFields();

        } catch (error) {
            console.error('Error restoring form data:', error);
            localStorage.removeItem('witness-chicago-form-data');
        }
    },

    // Setup conditional fields that show/hide based on checkboxes
    setupConditionalFields() {
        // Other violations field
        const violationOther = document.getElementById('violation-other');
        const violationOtherExplain = document.getElementById('violation-other-explain');
        
        if (violationOther && violationOtherExplain) {
            violationOther.addEventListener('change', (e) => {
                if (e.target.checked) {
                    violationOtherExplain.style.display = 'block';
                    const textarea = violationOtherExplain.querySelector('textarea');
                    if (textarea) {
                        setTimeout(() => textarea.focus(), 100);
                        this.announceToScreenReader('Additional field appeared for describing other violations');
                    }
                } else {
                    violationOtherExplain.style.display = 'none';
                    const textarea = violationOtherExplain.querySelector('textarea');
                    if (textarea) {
                        textarea.value = '';
                    }
                }
            });
        }
        
        // Unknown agency field
        const agencyUnknown = document.getElementById('agency-unknown');
        const agencyUnknownExplain = document.getElementById('agency-unknown-explain');
        
        if (agencyUnknown && agencyUnknownExplain) {
            agencyUnknown.addEventListener('change', (e) => {
                if (e.target.checked) {
                    agencyUnknownExplain.style.display = 'block';
                    const textarea = agencyUnknownExplain.querySelector('textarea');
                    if (textarea) {
                        setTimeout(() => textarea.focus(), 100);
                        this.announceToScreenReader('Additional field appeared for describing unknown agents');
                    }
                } else {
                    agencyUnknownExplain.style.display = 'none';
                    const textarea = agencyUnknownExplain.querySelector('textarea');
                    if (textarea) {
                        textarea.value = '';
                    }
                }
            });
        }
        
        // Other outcomes field
        const outcomeOther = document.getElementById('outcome-other');
        const outcomeOtherExplain = document.getElementById('outcome-other-explain');
        
        if (outcomeOther && outcomeOtherExplain) {
            outcomeOther.addEventListener('change', (e) => {
                if (e.target.checked) {
                    outcomeOtherExplain.style.display = 'block';
                    const textarea = outcomeOtherExplain.querySelector('textarea');
                    if (textarea) {
                        setTimeout(() => textarea.focus(), 100);
                        this.announceToScreenReader('Additional field appeared for describing other outcomes');
                    }
                } else {
                    outcomeOtherExplain.style.display = 'none';
                    const textarea = outcomeOtherExplain.querySelector('textarea');
                    if (textarea) {
                        textarea.value = '';
                    }
                }
            });
        }
    },

    // Restore conditional field visibility after form restoration
    restoreConditionalFields() {
        // Check violation-other
        const violationOther = document.getElementById('violation-other');
        const violationOtherExplain = document.getElementById('violation-other-explain');
        if (violationOther && violationOtherExplain && violationOther.checked) {
            violationOtherExplain.style.display = 'block';
        }
        
        // Check agency-unknown
        const agencyUnknown = document.getElementById('agency-unknown');
        const agencyUnknownExplain = document.getElementById('agency-unknown-explain');
        if (agencyUnknown && agencyUnknownExplain && agencyUnknown.checked) {
            agencyUnknownExplain.style.display = 'block';
        }
        
        // Check outcome-other
        const outcomeOther = document.getElementById('outcome-other');
        const outcomeOtherExplain = document.getElementById('outcome-other-explain');
        if (outcomeOther && outcomeOtherExplain && outcomeOther.checked) {
            outcomeOtherExplain.style.display = 'block';
        }
    },

    // Show notification that form data was restored
    showFormRestoredNotification(timestamp) {
        const notification = document.createElement('div');
        notification.className = 'form-restored-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <p><strong>Form data restored</strong> from ${new Date(timestamp).toLocaleString()}</p>
                <button onclick="WitnessApp.clearSavedFormData()" class="clear-btn">Clear Saved Data</button>
                <button onclick="this.parentElement.parentElement.remove()" class="dismiss-btn">×</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 1000;
            background: var(--color-success); color: white;
            padding: var(--space-4); border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg); max-width: 300px;
        `;
        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);

        this.announceToScreenReader('Previous form data has been restored');
    },

    // Clear saved form data
    clearSavedFormData() {
        localStorage.removeItem('witness-chicago-form-data');
        
        // Remove notification
        const notification = document.querySelector('.form-restored-notification');
        if (notification) {
            notification.remove();
        }
        
        this.announceToScreenReader('Saved form data cleared');
    },

    // Encryption setup using WebCrypto API
    async initializeEncryption() {
        try {
            // In production, this would be the actual public key from civil rights attorneys
            // For now, generate a key pair for demonstration
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: 'RSA-OAEP',
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256'
                },
                true,
                ['encrypt', 'decrypt']
            );
            
            this.state.encryptionKey = keyPair.publicKey;
            console.log('Encryption initialized successfully');
        } catch (error) {
            console.error('Encryption initialization failed:', error);
            this.showError('Encryption setup failed. Please refresh the page and try again.');
        }
    },

    // Set up event listeners
    setupEventListeners() {
        const form = document.getElementById('incident-form');
        const fileInput = document.getElementById('evidence-files');
        
        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // File upload
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Real-time validation
        form.addEventListener('input', (e) => this.handleInputChange(e));
        form.addEventListener('blur', (e) => this.handleInputBlur(e), true);
        
        // Keyboard navigation improvements
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    },

    // Setup accessibility features
    setupAccessibility() {
        // Announce dynamic content changes to screen readers
        this.createLiveRegion();
        
        // Enhanced focus management
        this.setupFocusManagement();
        
        // Skip links functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    },

    // Create ARIA live region for announcements
    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(liveRegion);
    },

    // Announce messages to screen readers
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    },

    // Enhanced focus management
    setupFocusManagement() {
        // Trap focus in modals/dialogs if any are added later
        // Ensure focus is visible
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, select, button, a')) {
                e.target.setAttribute('data-user-focused', 'true');
            }
        });
    },

    // Form validation setup
    setupFormValidation() {
        const form = document.getElementById('incident-form');
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            // Add validation attributes
            input.setAttribute('aria-describedby', `${input.id}-error`);
            
            // Create error message container
            const errorContainer = document.createElement('div');
            errorContainer.id = `${input.id}-error`;
            errorContainer.className = 'error-message-field';
            errorContainer.setAttribute('role', 'alert');
            errorContainer.style.cssText = 'color: var(--color-error); font-size: var(--font-size-sm); margin-top: var(--space-1); display: none;';
            
            input.parentNode.appendChild(errorContainer);
        });
    },

    // Setup real-time validation for email and phone
    setupRealTimeValidation() {
        const emailInput = document.getElementById('submitter-email');
        const phoneInput = document.getElementById('submitter-phone');
        
        if (emailInput) {
            this.setupEmailValidation(emailInput);
        }
        
        if (phoneInput) {
            this.setupPhoneValidation(phoneInput);
        }
    },

    // Setup conditional fields that show/hide based on checkboxes
    setupConditionalFields() {
        // Other violations field
        const violationOther = document.getElementById('violation-other');
        const violationOtherExplain = document.getElementById('violation-other-explain');
        
        if (violationOther && violationOtherExplain) {
            violationOther.addEventListener('change', (e) => {
                if (e.target.checked) {
                    violationOtherExplain.style.display = 'block';
                    const textarea = violationOtherExplain.querySelector('textarea');
                    if (textarea) {
                        setTimeout(() => textarea.focus(), 100);
                        this.announceToScreenReader('Additional field appeared for describing other violations');
                    }
                } else {
                    violationOtherExplain.style.display = 'none';
                    const textarea = violationOtherExplain.querySelector('textarea');
                    if (textarea) {
                        textarea.value = '';
                    }
                }
            });
        }
        
        // Unknown agency field
        const agencyUnknown = document.getElementById('agency-unknown');
        const agencyUnknownExplain = document.getElementById('agency-unknown-explain');
        
        if (agencyUnknown && agencyUnknownExplain) {
            agencyUnknown.addEventListener('change', (e) => {
                if (e.target.checked) {
                    agencyUnknownExplain.style.display = 'block';
                    const textarea = agencyUnknownExplain.querySelector('textarea');
                    if (textarea) {
                        setTimeout(() => textarea.focus(), 100);
                        this.announceToScreenReader('Additional field appeared for describing unknown agents');
                    }
                } else {
                    agencyUnknownExplain.style.display = 'none';
                    const textarea = agencyUnknownExplain.querySelector('textarea');
                    if (textarea) {
                        textarea.value = '';
                    }
                }
            });
        }
        
        // Other outcomes field
        const outcomeOther = document.getElementById('outcome-other');
        const outcomeOtherExplain = document.getElementById('outcome-other-explain');
        
        if (outcomeOther && outcomeOtherExplain) {
            outcomeOther.addEventListener('change', (e) => {
                if (e.target.checked) {
                    outcomeOtherExplain.style.display = 'block';
                    const textarea = outcomeOtherExplain.querySelector('textarea');
                    if (textarea) {
                        setTimeout(() => textarea.focus(), 100);
                        this.announceToScreenReader('Additional field appeared for describing other outcomes');
                    }
                } else {
                    outcomeOtherExplain.style.display = 'none';
                    const textarea = outcomeOtherExplain.querySelector('textarea');
                    if (textarea) {
                        textarea.value = '';
                    }
                }
            });
        }
    },

    // Restore conditional field visibility after form restoration
    restoreConditionalFields() {
        // Check violation-other
        const violationOther = document.getElementById('violation-other');
        const violationOtherExplain = document.getElementById('violation-other-explain');
        if (violationOther && violationOtherExplain && violationOther.checked) {
            violationOtherExplain.style.display = 'block';
        }
        
        // Check agency-unknown
        const agencyUnknown = document.getElementById('agency-unknown');
        const agencyUnknownExplain = document.getElementById('agency-unknown-explain');
        if (agencyUnknown && agencyUnknownExplain && agencyUnknown.checked) {
            agencyUnknownExplain.style.display = 'block';
        }
        
        // Check outcome-other
        const outcomeOther = document.getElementById('outcome-other');
        const outcomeOtherExplain = document.getElementById('outcome-other-explain');
        if (outcomeOther && outcomeOtherExplain && outcomeOther.checked) {
            outcomeOtherExplain.style.display = 'block';
        }
    },

    // Setup email validation with real-time feedback
    setupEmailValidation(emailInput) {
        let validationTimeout;
        
        // Create validation indicator
        const indicator = document.createElement('div');
        indicator.className = 'validation-indicator';
        indicator.id = `${emailInput.id}-indicator`;
        emailInput.parentNode.appendChild(indicator);
        
        emailInput.addEventListener('input', (e) => {
            clearTimeout(validationTimeout);
            
            // Clear previous validation state
            this.clearValidationIndicator(emailInput);
            
            const value = e.target.value.trim();
            
            // Don't validate empty optional fields
            if (!value) {
                return;
            }
            
            // Debounce validation to avoid excessive feedback
            validationTimeout = setTimeout(() => {
                this.validateEmailRealTime(emailInput, value);
            }, 300);
        });
        
        emailInput.addEventListener('blur', () => {
            const value = emailInput.value.trim();
            if (value) {
                this.validateEmailRealTime(emailInput, value);
            }
        });
    },

    // Real-time email validation
    validateEmailRealTime(emailInput, value) {
        const indicator = document.getElementById(`${emailInput.id}-indicator`);
        
        if (this.isValidEmail(value)) {
            this.showValidationSuccess(emailInput, 'Valid email address');
        } else {
            // Provide helpful feedback based on common issues
            let message = 'Please enter a valid email address';
            
            if (!value.includes('@')) {
                message = 'Email address must include @';
            } else if (!value.includes('.')) {
                message = 'Email address must include a domain (e.g., .com)';
            } else if (value.indexOf('@') === 0) {
                message = 'Email address cannot start with @';
            } else if (value.lastIndexOf('@') === value.length - 1) {
                message = 'Email address cannot end with @';
            }
            
            this.showValidationError(emailInput, message);
        }
    },

    // Setup phone validation with formatting
    setupPhoneValidation(phoneInput) {
        let validationTimeout;
        let isFormatting = false; // Flag to prevent cursor issues during formatting
        
        // Create validation indicator
        const indicator = document.createElement('div');
        indicator.className = 'validation-indicator';
        indicator.id = `${phoneInput.id}-indicator`;
        phoneInput.parentNode.appendChild(indicator);
        
        phoneInput.addEventListener('input', (e) => {
            if (isFormatting) return; // Skip if we're in the middle of formatting
            
            clearTimeout(validationTimeout);
            
            const input = e.target;
            const oldValue = input.value;
            const cursorPos = input.selectionStart;
            
            // Format phone number
            const formatted = this.formatPhoneNumber(oldValue);
            
            if (formatted !== oldValue) {
                isFormatting = true;
                
                // Calculate new cursor position
                const newCursorPos = this.calculateNewCursorPosition(oldValue, formatted, cursorPos);
                
                // Update value and cursor
                input.value = formatted;
                
                // Use setTimeout to ensure the value is set before moving cursor
                setTimeout(() => {
                    input.setSelectionRange(newCursorPos, newCursorPos);
                    isFormatting = false;
                }, 0);
            }
            
            // Clear previous validation state
            this.clearValidationIndicator(phoneInput);
            
            const value = input.value.trim();
            
            // Don't validate empty optional fields
            if (!value) {
                return;
            }
            
            // Debounce validation
            validationTimeout = setTimeout(() => {
                this.validatePhoneRealTime(phoneInput, value);
            }, 300);
        });
        
        phoneInput.addEventListener('blur', () => {
            const value = phoneInput.value.trim();
            if (value) {
                this.validatePhoneRealTime(phoneInput, value);
            }
        });
        
        // Handle paste events
        phoneInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                const formatted = this.formatPhoneNumber(e.target.value);
                e.target.value = formatted;
            }, 0);
        });
    },

    // Format phone number with better logic
    formatPhoneNumber(value) {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        
        // Limit to 10 digits
        const limitedDigits = digits.slice(0, 10);
        
        // Format based on length
        if (limitedDigits.length >= 6) {
            return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
        } else if (limitedDigits.length >= 3) {
            return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
        } else if (limitedDigits.length > 0) {
            return limitedDigits;
        } else {
            return '';
        }
    },

    // Calculate new cursor position after formatting
    calculateNewCursorPosition(oldValue, newValue, oldCursorPos) {
        // Count digits before cursor in old value
        const digitsBeforeCursor = oldValue.slice(0, oldCursorPos).replace(/\D/g, '').length;
        
        // Find position in new value that has same number of digits before it
        let digitCount = 0;
        for (let i = 0; i < newValue.length; i++) {
            if (/\d/.test(newValue[i])) {
                digitCount++;
                if (digitCount === digitsBeforeCursor) {
                    return i + 1;
                }
            }
        }
        
        // If we didn't find the position, put cursor at end
        return newValue.length;
    },

    // Real-time phone validation
    validatePhoneRealTime(phoneInput, value) {
        const digits = value.replace(/\D/g, '');
        
        if (digits.length === 10) {
            this.showValidationSuccess(phoneInput, 'Valid phone number');
        } else if (digits.length > 0) {
            if (digits.length < 10) {
                this.showValidationError(phoneInput, `Phone number needs ${10 - digits.length} more digits`);
            } else {
                this.showValidationError(phoneInput, 'Phone number is too long');
            }
        }
    },

    // Show validation success
    showValidationSuccess(input, message) {
        const indicator = document.getElementById(`${input.id}-indicator`);
        if (indicator) {
            indicator.innerHTML = `<span class="validation-success">✓ ${message}</span>`;
            input.classList.remove('validation-error');
            input.classList.add('validation-success');
        }
    },

    // Show validation error
    showValidationError(input, message) {
        const indicator = document.getElementById(`${input.id}-indicator`);
        if (indicator) {
            indicator.innerHTML = `<span class="validation-error">⚠ ${message}</span>`;
            input.classList.remove('validation-success');
            input.classList.add('validation-error');
        }
    },

    // Clear validation indicator
    clearValidationIndicator(input) {
        const indicator = document.getElementById(`${input.id}-indicator`);
        if (indicator) {
            indicator.innerHTML = '';
            input.classList.remove('validation-success', 'validation-error');
        }
    },

    // Handle keyboard navigation
    handleKeyboardNavigation(e) {
        // Escape key handling
        if (e.key === 'Escape') {
            // Close any open dialogs or clear focus if needed
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
        }
        
        // Enter key on buttons
        if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
            e.target.click();
        }
    },

    // Handle input changes for real-time validation
    handleInputChange(e) {
        if (e.target.matches('input, textarea, select')) {
            this.clearFieldError(e.target);
        }
    },

    // Handle input blur for validation
    handleInputBlur(e) {
        if (e.target.matches('input[required], textarea[required]')) {
            this.validateField(e.target);
        }
    },

    // Validate individual field
    validateField(field) {
        const errorContainer = document.getElementById(`${field.id}-error`);
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        
        // Date validation - within past year including today
        if (field.type === 'date' && field.value) {
            const selectedDate = new Date(field.value);
            const today = new Date();
            
            // Set today to end of day for comparison
            today.setHours(23, 59, 59, 999);
            
            // Calculate one year ago from today
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            
            if (selectedDate > today) {
                isValid = false;
                errorMessage = 'Incident date cannot be in the future.';
            } else if (selectedDate < oneYearAgo) {
                isValid = false;
                errorMessage = 'Incident date must be within the past year.';
            }
        }

        // Update field state
        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    // Show field error
    showFieldError(field, message) {
        const errorContainer = document.getElementById(`${field.id}-error`);
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('error');
        }
    },

    // Clear field error
    clearFieldError(field) {
        const errorContainer = document.getElementById(`${field.id}-error`);
        if (errorContainer) {
            errorContainer.textContent = '';
            errorContainer.style.display = 'none';
            field.removeAttribute('aria-invalid');
            field.classList.remove('error');
        }
    },

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Handle file selection
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        const validFiles = [];
        const errors = [];

        files.forEach(file => {
            // Validate file type
            if (!this.config.allowedFileTypes.includes(file.type)) {
                errors.push(`${file.name}: File type not allowed`);
                return;
            }

            // Validate file size
            if (file.size > this.config.maxFileSize) {
                errors.push(`${file.name}: File too large (max 10MB)`);
                return;
            }

            validFiles.push(file);
        });

        // Show errors if any
        if (errors.length > 0) {
            this.announceToScreenReader(`File validation errors: ${errors.join(', ')}`);
            alert(`File validation errors:\n${errors.join('\n')}`);
        }

        // Add valid files to state
        this.state.selectedFiles = [...this.state.selectedFiles, ...validFiles];
        this.updateFileList();
        
        // Clear file input
        e.target.value = '';
    },

    // Update file list display
    updateFileList() {
        const fileList = document.getElementById('file-list');
        
        if (this.state.selectedFiles.length === 0) {
            fileList.innerHTML = '';
            return;
        }

        const filesHTML = this.state.selectedFiles.map((file, index) => `
            <div class="file-item" role="listitem">
                <div>
                    <span class="file-name">${this.escapeHtml(file.name)}</span>
                    <span class="file-size">(${this.formatFileSize(file.size)})</span>
                </div>
                <button type="button" class="file-remove" onclick="WitnessApp.removeFile(${index})" aria-label="Remove ${this.escapeHtml(file.name)}">
                    Remove
                </button>
            </div>
        `).join('');

        fileList.innerHTML = `
            <h4>Selected Files (${this.state.selectedFiles.length}):</h4>
            <div role="list" aria-label="Selected files">
                ${filesHTML}
            </div>
        `;

        this.announceToScreenReader(`${this.state.selectedFiles.length} files selected`);
    },

    // Remove file from selection
    removeFile(index) {
        const removedFile = this.state.selectedFiles[index];
        this.state.selectedFiles.splice(index, 1);
        this.updateFileList();
        this.announceToScreenReader(`${removedFile.name} removed`);
    },

    // Format file size for display
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Handle form submission
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.state.isSubmitting) {
            return;
        }

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        this.state.isSubmitting = true;
        this.updateSubmitButton(true);
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Encrypt sensitive data
            const encryptedData = await this.encryptFormData(formData);
            
            // Submit to server
            await this.submitToServer(encryptedData);
            
            // Show success
            this.showSuccess();
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showError('Submission failed. Please try again. Your form data has been saved so you won\'t lose your work.');
        } finally {
            this.state.isSubmitting = false;
            this.updateSubmitButton(false);
        }
    },

    // Validate entire form
    validateForm() {
        const form = document.getElementById('incident-form');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalidField = null;

        // Clear any existing validation errors first
        this.clearAllValidationErrors();

        // Validate required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
                this.showFieldError(field, 'Please fill this out.');
            } else if (!this.validateField(field)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        // Special validation for radio groups
        const relationshipRadios = form.querySelectorAll('input[name="relationship"]');
        const relationshipSelected = Array.from(relationshipRadios).some(radio => radio.checked);
        if (!relationshipSelected) {
            isValid = false;
            const fieldset = relationshipRadios[0].closest('fieldset');
            if (fieldset && !firstInvalidField) {
                firstInvalidField = relationshipRadios[0];
            }
            
            // Show error for radio group
            this.showRadioGroupError('relationship', 'Please select your relationship to this incident.');
            this.announceToScreenReader('Please select your relationship to this incident');
        }

        // Privacy consent validation
        const privacyConsent = form.querySelector('#privacy-consent');
        if (!privacyConsent.checked) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = privacyConsent;
            }
            this.showFieldError(privacyConsent, 'You must agree to the privacy policy to submit a report.');
            this.announceToScreenReader('Privacy policy consent is required');
        }

        // Focus first invalid field
        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return isValid;
    },

    // Clear all validation errors
    clearAllValidationErrors() {
        const form = document.getElementById('incident-form');
        const errorMessages = form.querySelectorAll('.error-message-field');
        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        const invalidFields = form.querySelectorAll('[aria-invalid="true"]');
        invalidFields.forEach(field => {
            field.removeAttribute('aria-invalid');
            field.classList.remove('error');
        });

        // Clear radio group errors
        const radioGroupErrors = form.querySelectorAll('.radio-group-error');
        radioGroupErrors.forEach(error => error.remove());
    },

    // Show error for radio button groups
    showRadioGroupError(groupName, message) {
        const radioGroup = document.querySelector(`input[name="${groupName}"]`).closest('.radio-group');
        if (radioGroup) {
            // Remove existing error
            const existingError = radioGroup.querySelector('.radio-group-error');
            if (existingError) {
                existingError.remove();
            }

            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'radio-group-error error-message-field';
            errorDiv.textContent = message;
            errorDiv.style.cssText = 'color: var(--color-error); font-size: var(--font-size-sm); margin-top: var(--space-2);';
            errorDiv.setAttribute('role', 'alert');
            
            radioGroup.appendChild(errorDiv);
        }
    },

    // Collect form data
    collectFormData() {
        const form = document.getElementById('incident-form');
        const formData = new FormData(form);
        const data = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Add files
        data.files = this.state.selectedFiles;
        
        // Add metadata
        data.metadata = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            reportId: this.generateReportId()
        };

        return data;
    },

    // Generate unique report ID
    generateReportId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `WC-${timestamp}-${random}`.toUpperCase();
    },

    // Encrypt form data
    async encryptFormData(data) {
        if (!this.state.encryptionKey) {
            throw new Error('Encryption key not available');
        }

        try {
            // Separate sensitive and non-sensitive data
            const sensitiveFields = [
                'submitterName', 'submitterEmail', 'submitterPhone',
                'incidentDescription', 'peopleInvolved', 'files',
                'violationOtherDescription', 'agencyUnknownDescription', 'outcomeOtherDescription'
            ];

            const encryptedData = {
                ...data,
                encrypted: {}
            };

            // Encrypt sensitive fields
            for (const field of sensitiveFields) {
                if (data[field]) {
                    const plaintext = typeof data[field] === 'string' 
                        ? data[field] 
                        : JSON.stringify(data[field]);
                    
                    encryptedData.encrypted[field] = await this.encryptString(plaintext);
                    delete encryptedData[field];
                }
            }

            return encryptedData;
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Failed to encrypt data');
        }
    },

    // Encrypt string using RSA-OAEP
    async encryptString(plaintext) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext);
        
        // For large data, we'd typically use hybrid encryption (RSA + AES)
        // For simplicity, this example uses RSA directly (limited by key size)
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            this.state.encryptionKey,
            data
        );

        // Convert to base64 for transmission
        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    },

    // Submit to server
    async submitToServer(encryptedData) {
        // In production, this would be the actual API endpoint
        const endpoint = this.config.apiEndpoint || '/api/submit-report';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(encryptedData)
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    },

    // Update submit button state
    updateSubmitButton(isLoading) {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (isLoading) {
            submitBtn.disabled = true;
            btnText.hidden = true;
            btnLoading.hidden = false;
            this.announceToScreenReader('Encrypting and submitting report');
        } else {
            submitBtn.disabled = false;
            btnText.hidden = false;
            btnLoading.hidden = true;
        }
    },

    // Show success message
    showSuccess() {
        const form = document.getElementById('incident-form');
        const successMessage = document.getElementById('success-message');
        const reportIdSpan = document.getElementById('report-id');
        
        // Hide form and show success
        form.style.display = 'none';
        successMessage.hidden = false;
        
        // Set report ID
        const reportId = this.generateReportId();
        reportIdSpan.textContent = reportId;
        
        // Clear saved form data since submission was successful
        localStorage.removeItem('witness-chicago-form-data');
        
        // Announce to screen readers
        this.announceToScreenReader('Report submitted successfully. Your report ID is ' + reportId);
        
        // Focus on success message
        successMessage.focus();
        successMessage.scrollIntoView({ behavior: 'smooth' });
    },

    // Reset form for new report
    resetForNewReport() {
        const form = document.getElementById('incident-form');
        const successMessage = document.getElementById('success-message');
        
        // Reset form
        form.reset();
        this.state.selectedFiles = [];
        this.updateFileList();
        
        // Clear saved data
        localStorage.removeItem('witness-chicago-form-data');
        
        // Clear validation indicators
        const indicators = form.querySelectorAll('.validation-indicator');
        indicators.forEach(indicator => indicator.innerHTML = '');
        
        const validatedFields = form.querySelectorAll('.validation-success, .validation-error');
        validatedFields.forEach(field => {
            field.classList.remove('validation-success', 'validation-error');
        });
        
        // Hide conditional fields
        const conditionalFields = form.querySelectorAll('.conditional-field');
        conditionalFields.forEach(field => {
            field.style.display = 'none';
            const textarea = field.querySelector('textarea');
            if (textarea) {
                textarea.value = '';
            }
        });
        
        // Show form, hide success
        form.style.display = 'block';
        successMessage.hidden = true;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Focus on first input
        const firstInput = form.querySelector('input, textarea');
        if (firstInput) {
            firstInput.focus();
        }
        
        this.announceToScreenReader('New report form ready');
    },

    // Show error message
    showError(message) {
        const errorMessage = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        
        errorText.textContent = message;
        errorMessage.hidden = false;
        
        this.announceToScreenReader('Error: ' + message);
        
        // Focus on error message
        errorMessage.focus();
        errorMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Hide error after 10 seconds
        setTimeout(() => {
            errorMessage.hidden = true;
        }, 10000);
    }
};

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WitnessApp.init());
} else {
    WitnessApp.init();
}

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    WitnessApp.showError('An unexpected error occurred. Please refresh the page and try again.');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    WitnessApp.showError('An unexpected error occurred. Please refresh the page and try again.');
});

// Export for global access (needed for onclick handlers)
window.WitnessApp = WitnessApp;