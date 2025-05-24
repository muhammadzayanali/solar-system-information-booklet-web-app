from flask import Flask, jsonify, request, session
from flask_cors import CORS
import mysql.connector
import bcrypt
import os
from dotenv import load_dotenv
from functools import wraps
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get('SECRET_KEY') or os.urandom(24).hex()

db_config = {
    'host': os.environ.get('DB_HOST'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'database': os.environ.get('DB_NAME')
}

def get_db():
    return mysql.connector.connect(**db_config)

# Authentication decorators
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized"}), 401
            
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT role FROM users WHERE id = %s", (session['user_id'],))
        user = cursor.fetchone()
        db.close()
        
        if not user or user.get('role') != 'admin':
            return jsonify({"error": "Admin access required"}), 403
            
        return f(*args, **kwargs)
    return decorated_function

# ========================
# AUTHENTICATION ROUTES
# ========================

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        required_fields = ['username', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("SELECT id FROM users WHERE email = %s", (data['email'],))
        if cursor.fetchone():
            return jsonify({"error": "Email already exists"}), 400
        
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, role) VALUES (%s, %s, %s, %s)",
            (data['username'], data['email'], hashed, data.get('role', 'user')))
        db.commit()
        
        session['user_id'] = cursor.lastrowid
        return jsonify({
            "success": True, 
            "message": "Registration successful",
            "user": {
                "id": cursor.lastrowid,
                "role": data.get('role', 'user')
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password required"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute("SELECT id, username, email, password_hash, role FROM users WHERE email = %s", (data['email'],))
        user = cursor.fetchone()
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password_hash'].encode('utf-8')):
            session['user_id'] = user['id']
            return jsonify({
                "success": True, 
                "message": "Login successful",
                "user": {
                    "id": user['id'],
                    "username": user['username'],
                    "email": user['email'],
                    "role": user['role']
                }
            })
            
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True, "message": "Logged out"})

@app.route('/check-auth')
def check_auth():
    if 'user_id' not in session:
        return jsonify({"authenticated": False})
    
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email, role FROM users WHERE id = %s", (session['user_id'],))
        user = cursor.fetchone()
        return jsonify({
            "authenticated": True, 
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email'],
                "role": user['role']
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

# ========================
# SOLAR SYSTEM DATA ROUTES (CRUD)
# ========================

# Planets CRUD
@app.route('/planets', methods=['GET'])
def get_planets():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM planets")
        return jsonify(cursor.fetchall())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/planets', methods=['POST'])
@admin_required
def add_planet():
    try:
        data = request.json
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO planets (name, distance_from_sun, diameter, orbital_period, details) VALUES (%s, %s, %s, %s, %s)",
            (data['name'], data['distance_from_sun'], data['diameter'], data['orbital_period'], data['details'])
        )
        db.commit()
        return jsonify({"success": True, "id": cursor.lastrowid})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/planets/<int:planet_id>', methods=['PUT'])
@admin_required
def update_planet(planet_id):
    try:
        data = request.json
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE planets SET name=%s, distance_from_sun=%s, diameter=%s, orbital_period=%s, details=%s WHERE id=%s",
            (data['name'], data['distance_from_sun'], data['diameter'], data['orbital_period'], data['details'], planet_id)
        )
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/planets/<int:planet_id>', methods=['DELETE'])
@admin_required
def delete_planet(planet_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM planets WHERE id=%s", (planet_id,))
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

# Asteroids CRUD (similar to planets)
@app.route('/asteroids', methods=['GET'])
def get_asteroids():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM asteroids")
        return jsonify(cursor.fetchall())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/asteroids', methods=['POST'])
@admin_required
def add_asteroid():
    try:
        data = request.json
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO asteroids (name, discovery_year, diameter, distance_from_sun, details) VALUES (%s, %s, %s, %s, %s)",
            (data['name'], data['discovery_year'], data['diameter'], data['distance_from_sun'], data['details'])
        )
        db.commit()
        return jsonify({"success": True, "id": cursor.lastrowid})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/asteroids/<int:asteroid_id>', methods=['PUT'])
@admin_required
def update_asteroid(asteroid_id):
    try:
        data = request.json
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE asteroids SET name=%s, discovery_year=%s, diameter=%s, distance_from_sun=%s, details=%s WHERE id=%s",
            (data['name'], data['discovery_year'], data['diameter'], data['distance_from_sun'], data['details'], asteroid_id)
        )
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/asteroids/<int:asteroid_id>', methods=['DELETE'])
@admin_required
def delete_asteroid(asteroid_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM asteroids WHERE id=%s", (asteroid_id,))
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

# Comets CRUD (similar to planets)
@app.route('/comets', methods=['GET'])
def get_comets():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM comets")
        return jsonify(cursor.fetchall())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/comets', methods=['POST'])
@admin_required
def add_comet():
    try:
        data = request.json
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO comets (name, distance_from_sun, orbital_period, last_observed, details) VALUES (%s, %s, %s, %s, %s)",
            (data['name'], data['distance_from_sun'], data['orbital_period'], data['last_observed'], data['details'])
        )
        db.commit()
        return jsonify({"success": True, "id": cursor.lastrowid})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/comets/<int:comet_id>', methods=['PUT'])
@admin_required
def update_comet(comet_id):
    try:
        data = request.json
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE comets SET name=%s, distance_from_sun=%s, orbital_period=%s, last_observed=%s, details=%s WHERE id=%s",
            (data['name'], data['distance_from_sun'], data['orbital_period'], data['last_observed'], data['details'], comet_id)
        )
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/comets/<int:comet_id>', methods=['DELETE'])
@admin_required
def delete_comet(comet_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM comets WHERE id=%s", (comet_id,))
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

# ========================
# QUIZ SYSTEM ROUTES
# ========================

@app.route('/quiz/categories')
def get_quiz_categories():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT DISTINCT category FROM quizzes")
        categories = [item['category'] for item in cursor.fetchall()]
        return jsonify(categories)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/quiz/<category>')
def get_quiz_questions(category):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, category, question, option_a, option_b, option_c, option_d, correct_answer 
            FROM quizzes 
            WHERE category = %s
        """, (category,))
        questions = cursor.fetchall()
        
        # Format questions for the quiz
        formatted_questions = []
        for q in questions:
            formatted_questions.append({
                'id': q['id'],
                'category': q['category'],
                'question': q['question'],
                'options': {
                    'a': q['option_a'],
                    'b': q['option_b'],
                    'c': q['option_c'],
                    'd': q['option_d']
                },
                'correct_answer': q['correct_answer']
            })
        
        return jsonify(formatted_questions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/quiz', methods=['POST'])
@admin_required
def add_quiz_question():
    try:
        data = request.json
        required_fields = ['category', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            """INSERT INTO quizzes 
            (category, question, option_a, option_b, option_c, option_d, correct_answer) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (data['category'], data['question'], data['option_a'], 
             data['option_b'], data['option_c'], data['option_d'], 
             data['correct_answer'])
        )
        db.commit()
        
        # Get the newly added question
        cursor.execute("""
            SELECT id, category, question, option_a, option_b, option_c, option_d, correct_answer 
            FROM quizzes 
            WHERE id = %s
        """, (cursor.lastrowid,))
        new_question = cursor.fetchone()
        
        return jsonify({
            "success": True, 
            "question": {
                'id': new_question['id'],
                'category': new_question['category'],
                'question': new_question['question'],
                'options': {
                    'a': new_question['option_a'],
                    'b': new_question['option_b'],
                    'c': new_question['option_c'],
                    'd': new_question['option_d']
                },
                'correct_answer': new_question['correct_answer']
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/quiz/<int:question_id>', methods=['PUT'])
@admin_required
def update_quiz_question(question_id):
    try:
        data = request.json
        required_fields = ['category', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        # Update the question
        cursor.execute(
            """UPDATE quizzes SET 
            category=%s, question=%s, option_a=%s, option_b=%s, 
            option_c=%s, option_d=%s, correct_answer=%s 
            WHERE id=%s""",
            (data['category'], data['question'], data['option_a'], 
             data['option_b'], data['option_c'], data['option_d'], 
             data['correct_answer'], question_id)
        )
        db.commit()
        
        # Get the updated question
        cursor.execute("""
            SELECT id, category, question, option_a, option_b, option_c, option_d, correct_answer 
            FROM quizzes 
            WHERE id = %s
        """, (question_id,))
        updated_question = cursor.fetchone()
        
        return jsonify({
            "success": True,
            "question": {
                'id': updated_question['id'],
                'category': updated_question['category'],
                'question': updated_question['question'],
                'options': {
                    'a': updated_question['option_a'],
                    'b': updated_question['option_b'],
                    'c': updated_question['option_c'],
                    'd': updated_question['option_d']
                },
                'correct_answer': updated_question['correct_answer']
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/quiz/<int:question_id>', methods=['DELETE'])
@admin_required
def delete_quiz_question(question_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM quizzes WHERE id=%s", (question_id,))
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/quiz/submit', methods=['POST'])
@login_required
def submit_quiz():
    try:
        data = request.json
        required_fields = ['category', 'answers']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        user_id = session['user_id']
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        # Get correct answers
        cursor.execute("""
            SELECT id, correct_answer 
            FROM quizzes 
            WHERE category = %s
        """, (data['category'],))
        correct_answers = {str(item['id']): item['correct_answer'] for item in cursor.fetchall()}
        
        # Calculate score
        score = sum(1 for q_id, ans in data['answers'].items() 
                if correct_answers.get(q_id) == ans)
        total = len(correct_answers)
        
        # Store result
        cursor.execute(
            """INSERT INTO quiz_results 
            (user_id, category, score, total, taken_at) 
            VALUES (%s, %s, %s, %s, %s)""",
            (user_id, data['category'], score, total, datetime.now())
        )
        db.commit()
        
        return jsonify({
            "score": score,
            "total": total,
            "percentage": int((score / total) * 100) if total > 0 else 0,
            "category": data['category']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/quiz/results')
@login_required
def get_user_quiz_results():
    try:
        user_id = session['user_id']
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        # Get user info
        cursor.execute("SELECT username, email FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        # Get quiz results
        cursor.execute("""
            SELECT category, score, total, taken_at 
            FROM quiz_results 
            WHERE user_id = %s 
            ORDER BY taken_at DESC
        """, (user_id,))
        results = cursor.fetchall()
        
        # Format results
        formatted_results = []
        for result in results:
            formatted_results.append({
                "category": result['category'],
                "score": f"{result['score']}/{result['total']}",
                "percentage": f"{round((result['score']/result['total'])*100, 1)}%",
                "date": result['taken_at'].strftime("%Y-%m-%d %H:%M")
            })
        
        return jsonify({
            "user": {
                "username": user['username'],
                "email": user['email']
            },
            "results": formatted_results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

@app.route('/admin/quiz-results')
@admin_required
def get_all_quiz_results():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        # Get all results with user info
        cursor.execute("""
           select * from user_quiz_results_view;
        """)
        results = cursor.fetchall()
        
        # Format results
        formatted_results = []
        for result in results:
            formatted_results.append({
                "username": result['username'],
                "email": result['email'],
                "category": result['category'],
                "score": f"{result['score']}/{result['total']}",
                "percentage": f"{result['percentage']}%",
                "date": result['taken_at'].strftime("%Y-%m-%d %H:%M")
            })
        
        return jsonify(formatted_results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'db' in locals(): db.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)