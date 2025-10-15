from flask import Flask, request, redirect, send_from_directory
import csv

app = Flask(__name__)

# Serve main page
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# Serve static files
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# Handle form submission
@app.route('/join', methods=['POST'])
def join():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    # Save form data to CSV
    with open('form_data.csv', mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([name, email, message])

    # Display Thank You message
    return """
    <html>
    <body style='text-align:center; font-family:sans-serif; background:#e8f5e9;'>
        <h2>🌳 Thank you for joining the campaign, Diksha!</h2>
        <p>Your data has been saved successfully.</p>
        <a href="/" style='text-decoration:none; color:#2e7d32;'>← Go Back</a>
    </body>
    </html>
    """

if __name__ == "__main__":
    app.run(debug=True)
