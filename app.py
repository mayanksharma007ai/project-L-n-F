
import sqlite3
from flask import Flask , request , jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

# Load the variables from your .env file
load_dotenv() 

# --- (Your other imports like Flask, cloudinary, etc.) ---

# Configure Cloudinary using the loaded environment variables
cloudinary.config( 
  cloud_name = os.getenv("CLOUD_NAME"), 
  api_key = os.getenv("API_KEY"), 
  api_secret = os.getenv("API_SECRET") 
)

# --- (The rest of your app.py code) ---

# connects to database
def get_db_connection():
    conn = sqlite3.connect('Campus_data.db')
    conn.row_factory = sqlite3.Row
    return conn


# when user signs up

@app.route('/api/signup', methods=['POST'])

def signup():
    data = request.get_json()
    
    if not data or not 'Name' in data or not 'Email' in data or not 'Password' in data:
        return jsonify({'error': 'Missing credentials'}), 400

    
    Name = data['Name']
    Email = data['Email']
    Password = data['Password']

    conn = get_db_connection()
    cursor = conn.cursor()

    # check if email already exists
    user = cursor.execute('SELECT * FROM User WHERE Email = ?', (Email,)).fetchone()

    if user:
        conn.close()
        return jsonify({'error': 'Email already exist'}), 409
    
    cursor.execute('INSERT INTO User (Name,Email,Password) VALUES (?,?,?)', (Name,Email,Password))
    conn.commit()
    conn.close()

    return jsonify({'message': 'User Succesfully created'}), 201

# when user logs in

@app.route('/api/login', methods=['POST'])

def login():
    data = request.get_json()

    if not data or not 'email' in data or not 'password' in data:
        return jsonify({'error': 'Missing credentials'}), 400

    email = data['email']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()

    user = cursor.execute('SELECT * FROM User WHERE Email = ?', (email,)).fetchone()
    conn.close()

    if user and user['Password'] == password:
        return jsonify({'message' : 'Login succesful'}), 200

    else:
        return jsonify({'error': 'Invalid Email or password'}), 401

cloudinary.config( 
  cloud_name = os.getenv("CLOUD_NAME"), 
  api_key = os.getenv("API_KEY"), 
  api_secret = os.getenv("API_SECRET")
)

@app.route('/api/create_post', methods=['POST'])
def create_post():
    try:
        # get all the form data
        itemName = request.form.get('itemName')
        phoneNumber = request.form.get('phoneNumber')
        location = request.form.get('location')
        description = request.form.get('description')
        category = request.form.get('category')
        userEmail = request.form.get('userEmail') 

        image_file = request.files.get('image')

        # check if they filled everything
        if not all([itemName, phoneNumber, location, description, category]):
            return jsonify({'error': 'Missing required fields'}), 400

        imageUrl = '' 
        if image_file:
            try:
                upload_result = cloudinary.uploader.upload(image_file)
                imageUrl = upload_result['secure_url']
                print(f"Image uploaded successfully: {imageUrl}")
            except Exception as e:
                print(f"Cloudinary Error: {e}")
                return jsonify({'error': 'Image upload failed'}), 500

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO Items (itemName, phoneNumber, location, description, imageUrl, category, userEmail) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (itemName, phoneNumber, location, description, imageUrl, category, userEmail)
            )
            conn.commit()
            conn.close()
            return jsonify({'message': 'Post created successfully'}), 201
        except Exception as e:
            print(f"Database error: {e}")
            return jsonify({'error': 'An internal error occurred'}), 500
            
    except Exception as e:
        print(f"General error: {e}")
        return jsonify({'error': 'Request processing failed'}), 500


@app.route('/api/items', methods=['GET'])
def get_items():
    try:
        conn = get_db_connection()
        items_cursor = conn.execute('SELECT * FROM Items ORDER BY id DESC')
        items = items_cursor.fetchall()
        conn.close()

        # make it into a list
        items_list = [dict(item) for item in items]

        return jsonify(items_list)
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Failed to fetch items"}), 500

# get user info
@app.route('/api/user', methods=['POST'])
def get_user():
    try:
        data = request.get_json()
        email = data.get('email')
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM User WHERE Email = ?', (email,)).fetchone()
        conn.close()
        
        if user:
            return jsonify(dict(user))
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Failed to fetch user"}), 500

# get user's posts
@app.route('/api/user-posts', methods=['GET'])
def get_user_posts():
    try:
        email = request.args.get('email')
        if not email:
            return jsonify({"error": "Email required"}), 400
            
        conn = get_db_connection()
        items_cursor = conn.execute('SELECT * FROM Items WHERE userEmail = ? ORDER BY id DESC', (email,))
        items = items_cursor.fetchall()
        conn.close()

        items_list = [dict(item) for item in items]
        return jsonify(items_list)
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Failed to fetch user posts"}), 500

# delete a post
@app.route('/api/delete-post/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # check if post exists
        post = cursor.execute('SELECT * FROM Items WHERE id = ?', (post_id,)).fetchone()
        if not post:
            conn.close()
            return jsonify({"error": "Post not found"}), 404
        
        # delete the post
        cursor.execute('DELETE FROM Items WHERE id = ?', (post_id,))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Post deleted successfully"}), 200
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Failed to delete post"}), 500

# upload user avatar
@app.route('/api/upload-avatar', methods=['POST'])
def upload_avatar():
    try:
        image_file = request.files.get('image')
        
        if not image_file:
            return jsonify({'error': 'No image provided'}), 400
        
        # upload to cloudinary
        try:
            upload_result = cloudinary.uploader.upload(image_file)
            avatar_url = upload_result['secure_url']
            print(f"Avatar uploaded successfully: {avatar_url}")
            
            return jsonify({'avatarUrl': avatar_url}), 200
        except Exception as e:
            print(f"Cloudinary Error: {e}")
            return jsonify({'error': 'Image upload failed'}), 500
            
    except Exception as e:
        print(f"General error: {e}")
        return jsonify({'error': 'Request processing failed'}), 500


@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()

    # Validate
    required_fields = ['name', 'email', 'subject', 'category', 'message']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    name = data['name']
    email = data['email']
    subject = data['subject']
    category = data['category']
    message = data['message']
    subscribe = data.get('subscribe', False)  # default False

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                category TEXT NOT NULL,
                message TEXT NOT NULL,
                subscribe INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        cursor.execute(
            "INSERT INTO Feedback (name, email, subject, category, message, subscribe) VALUES (?, ?, ?, ?, ?, ?)",
            (name, email, subject, category, message, int(subscribe))
        )

        conn.commit()
        conn.close()

        return jsonify({"message": "Feedback saved successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
