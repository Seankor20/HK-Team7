from flask import Flask, jsonify, request
from config import supabase
import os

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role')
        hkid = data.get('hkid')
        school = data.get('school')

        response = supabase.auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {"data": {
                    "name": name,
                    "role": role,
                    "hkid": hkid,
                    "school": school,
                    "xp": 0
                }}
            }
        )
        # Return only the necessary parts of the response
        return jsonify({"message": "User created successfully"}), 201
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
        metadata = getattr(response.user, "user_metadata", None)

        return jsonify({
            "message": "User logged in successfully",
            "email": email,
            "user_id": user_id,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_in": expires_in,
            "metadata": metadata
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    try:
        # Define the absolute path to your data directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        image_path = os.path.join(current_dir, 'documents', 'IMG_6082.png')

        # Read the file as bytes
        with open(image_path, "rb") as f:
            file_bytes = f.read()

        # Define the path in Supabase storage (e.g. "IMG_6082.png")
        upload_path = 'IMG_6082.png'

        # Upload file with correct mimetype (for PNG: "image/png")
        response = supabase.storage.from_('docs/pdfs').upload(
            upload_path,
            file_bytes,
            {"content-type": "image/png"}
        )

        return jsonify({"message": "Image uploaded successfully", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    