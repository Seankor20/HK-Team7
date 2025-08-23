from flask import Flask, jsonify, request
from config import supabase
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)
@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        response = supabase.auth.sign_up(
            {
                "email": email,
                "password": password,
            }
        )
        # Return only the necessary parts of the response
        return jsonify({"message": "User created successfully", "response": response}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        response = supabase.auth.sign_in_with_password(
            {
                "email": email,
                "password": password,
            }
        )
        # Get the email
        email = getattr(response.user, "email", None)
        # Get the user id
        user_id = getattr(response.user, "id", None)
        # Extract the access token from the session
        access_token = getattr(response.session, "access_token", None)
        # Optionally, extract other tokens as needed
        refresh_token = getattr(response.session, "refresh_token", None)
        expires_in = getattr(response.session, "expires_in", None)

        return jsonify({
            "message": "User logged in successfully",
            "email": email,
            "user_id": user_id,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_in": expires_in
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    