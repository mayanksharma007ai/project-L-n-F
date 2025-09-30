==================================
CampusConnect: Lost & Found App
==================================

A full-stack web application designed to streamline the lost and found process on a university campus. This project provides a central platform for students to post about lost or found items and connect with each other to arrange a return.

---
Key Features
---
* User Authentication: Secure user sign-up and sign-in system.
* Post Creation: Users can create detailed posts for lost or found items with descriptions and images.
* Item Feed: A dynamic homepage that displays all recently posted items.
* Direct Messaging: A real-time chat system for users to communicate privately.

---
Tech Stack
---
* Frontend: Plain HTML, CSS, and JavaScript
* Backend: Python with Flask & Flask-SocketIO
* Database: SQLite
* Image Hosting: Cloudinary API

---
How to Run
---

**Backend Setup:**
1. Navigate to the backend project folder.
2. Create and activate a virtual environment:
   python -m venv venv
   venv\Scripts\activate
3. Install the required packages from a requirements.txt file:
   pip install Flask Flask-SocketIO Flask-Cors python-dotenv cloudinary
4. Create a .env file for your Cloudinary API keys.
5. Run the server:
   python app.py
   (The backend will run at http://localhost:5000)

**Frontend Setup:**
1. Navigate to the frontend project folder.
2. Open the home.html file in your web browser. No special commands are needed.

---
License
---

Copyright (c) 2025 Harsh Dabas ,Mayank Jangid and Khushi.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.