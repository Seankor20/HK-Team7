from flask import Flask, jsonify, request
from config import supabase
from flask_cors import CORS 
import os

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
        # Get the file from the request (the field name should match what the client uses)
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Check if the uploaded file is a PDF
        if file.content_type != "application/pdf":
            return jsonify({"error": "Only PDF files are allowed"}), 400

        file_bytes = file.read()          # Read the PDF file as bytes
        upload_path = file.filename       # Use the original filename or customize as desired

        # Upload the PDF to Supabase Storage with correct mimetype
        response = supabase.storage.from_('docs/pdfs').upload(
            upload_path,
            file_bytes,
            {"content-type": "application/pdf"}
        )

        return jsonify({"message": "PDF uploaded successfully", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/upload_image', methods=['POST'])
def upload_image():
    try:
        # Get the file from the request (the field name should match what the client uses)
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Check if the uploaded file is a PDF
        print(file.content_type)
        if file.content_type not in ["image/jpeg", "image/png"]:
            return jsonify({"error": "Only jpeg and png files are allowed"}), 400

        file_bytes = file.read()          # Read the PDF file as bytes
        upload_path = file.filename       # Use the original filename or customize as desired

        # Upload the PDF to Supabase Storage with correct mimetype
        response = supabase.storage.from_('docs/images').upload(
            upload_path,
            file_bytes,
            {"content-type": file.content_type}
        )

        return jsonify({"message": "Image uploaded successfully", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/upload_video', methods=['POST'])
def upload_video():
    try:
        # Get the file from the request (the field name should match what the client uses)
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Check if the uploaded file is a video
        if file.content_type not in ["video/mp4", "video/x-msvideo"]:
            return jsonify({"error": "Only mp4 and avi files are allowed"}), 400

        file_bytes = file.read()          # Read the PDF file as bytes
        upload_path = file.filename       # Use the original filename or customize as desired

        # Upload the PDF to Supabase Storage with correct mimetype
        response = supabase.storage.from_('docs/videos').upload(
            upload_path,
            file_bytes,
            {"content-type": file.content_type}
        )

        return jsonify({"message": "Video uploaded successfully", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_images', methods=['GET'])
def get_images():
    try:
        response = supabase.storage.from_('docs').list('images')
        files = response  # List of file objects
        print(files)

        file_urls = []
        for file_info in files:
            # For files inside a folder, the path is "images/filename"
            file_path = f"images/{file_info['name']}"
            url_data = supabase.storage.from_('docs').get_public_url(file_path)
            file_urls.append(url_data)  # For supabase-py v2; adjust if SDK returns directly

        # Return URLs to frontend
        return jsonify({"image_urls": file_urls}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_videos', methods=['GET'])
def get_videos():
    try:
        response = supabase.storage.from_('docs').list('videos')
        files = response  # List of file objects
        print(files)

        file_urls = []
        for file_info in files:
            # For files inside a folder, the path is "videos/filename"
            file_path = f"videos/{file_info['name']}"
            url_data = supabase.storage.from_('docs').get_public_url(file_path)
            file_urls.append(url_data)  # For supabase-py v2; adjust if SDK returns directly

        # Return URLs to frontend
        return jsonify({"video_urls": file_urls}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/get_pdfs', methods=['GET'])
def get_pdfs():
    try:
        response = supabase.storage.from_('docs').list('pdfs')
        files = response  # List of file objects
        print(files)

        file_urls = []
        for file_info in files:
            # For files inside a folder, the path is "pdfs/filename"
            file_path = f"pdfs/{file_info['name']}"
            url_data = supabase.storage.from_('docs').get_public_url(file_path)
            file_urls.append(url_data)  # For supabase-py v2; adjust if SDK returns directly

        # Return URLs to frontend
        return jsonify({"pdf_urls": file_urls}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    