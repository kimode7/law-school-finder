from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3

app = Flask(__name__)

# Function to connect to the database

def get_db_connection():
    conn = sqlite3.connect('schools.db')
    conn.row_factory = sqlite3.Row  # Access columns by name as a dictionary instead of tuple
    return conn

# Function to return list of schools that match the user is likely to get into based on stats
def match(loc, lsat, gpa):
    # connects to database
    conn = sqlite3.connect('schools.db')
    cursor = conn.cursor()

    # stores possible matches
    matches = []
    
    # Query all schools and filter based on criteria
    cursor.execute('SELECT * FROM schools')
    schools = cursor.fetchall()
    for school in schools:
        # stores school variables in a tuple
        school_name, school_group, school_loc, school_lsat, school_gpa, school_acc_rate, school_size, school_tuition, school_oos_tuition, school_description = school

        temp_gpa = gpa + 0.3 if lsat > school_lsat + 2 else gpa
        if (
            school_loc == loc and 
            school_lsat <= lsat - 2 and 
            school_gpa <= temp_gpa - 0.05
        ):
            matches.append(school)
    conn.close()
    
    return matches

# Welcome page 
@app.route('/', methods=['GET', 'POST'])
def welcome():
    if request.method == 'POST':
        # Get user input
        lsat = int(request.form['lsat'])
        gpa = float(request.form['gpa'])
        state = request.form['state']
        
        # Redirect to results page user inputs
        return redirect(url_for('results', lsat=lsat, gpa=gpa, state=state))
    return render_template('welcome.html')

# Results page
@app.route('/results')
def results():
    # Retrieve query parameters
    lsat = int(request.args.get('lsat'))
    gpa = float(request.args.get('gpa'))
    state = request.args.get('state')
    
    # Get matching schools
    matches = match(state, lsat, gpa)
    return render_template('results.html', matches=matches, lsat=lsat, gpa=gpa, state=state)

# Filter/main page
@app.route('/index')
def index():
    return render_template('index.html')  


# acts as "API" for JS, builds quiery based on user inputs and selects data for DB that match up
@app.route('/api/schools', methods=['GET'])
def get_schools():
    # Get filters from query parameters
    state = request.args.get('state')
    min_lsat = request.args.get('lsat')
    min_gpa = request.args.get('gpa')

    # Build SQL query dynamically
    query = "SELECT * FROM schools WHERE 1=1" # allows me to built upon query with "AND"
    params = []

    # appends elements that are the same state and have the min lsat and gpa theshhold from the user input
    if state:
        query += " AND location LIKE ?"
        params.append(f"%{state}%")  
    if min_lsat:
        query += " AND lsat >= ?"
        params.append(min_lsat) 
    if min_gpa:
        query += " AND gpa >= ?"
        params.append(min_gpa)

    # Execute query and get results
    conn = get_db_connection()
    schools = conn.execute(query, params).fetchall()
    conn.close()

    # Convert rows to list of dictionaries to send as JSON
    schools_list = [dict(row) for row in schools]
    return jsonify(schools_list)




