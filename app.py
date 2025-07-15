from flask import Flask, render_template, request

app = Flask(__name__)

# Dummy database for staff credentials
STAFF_DB = {
    "12345": "password123"
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-coe', methods=['POST'])
def generate_coe():
    employee_id = request.form['employee_id']
    password = request.form['password']

    if employee_id in STAFF_DB and STAFF_DB[employee_id] == password:
        # In a real application, you would generate a PDF here
        # and email it to the user.
        return "COE has been sent to your email."
    else:
        return "Invalid credentials."

if __name__ == '__main__':
    app.run(debug=True)
