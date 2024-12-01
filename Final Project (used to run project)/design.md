Overview:
    The Law School Finder is a web application designed to assist prospective law students in discovering schools that best match their qualifications and preferences. Users can filter law schools based on criteria such as LSAT score, GPA, and state. The app presents law schools in an organized and user-friendly format, allowing for ease-of-use

Background:
    This project was originally aimed to help high-school students find different colleges to apply to. I had great difficulty finding free datasets/API's that contained all of the information I wanted for every school, due to the shear number of universities in the US (over 5300). I didn't just want to include the top 100 schools because I wanted my project to helpful for the average student. I decided to limit my scope to law schools becasue there are only 196 acredited law schools in the US, and I found a great dataset encompassing lots of information on them.

How I went about the project:

    Data science portion:
        When I found that a dataset I liked, I had to analyze it's data. I used Jupyter notebook and the popular data science module, pandas to do so. The dataset I found contained multiple csv files, so first I choose the files containing the information I wanted to include in the project and assigned them to different pandas dataframes.
    
        After analyzing the dataframes I noticed a descripancy in the data. The length 2 of the datasets was different, so I used a built-in function to drop the schools that were not present in the small dataset. Becasue the name of the schools were unique, I treated that as my key and stored the information about the school in a list as a value in a dictionary.
    
        After I created the dictionary of schools, I went on about creating the match function of the project. I had to do extensive research on the law school admission process, which is depicted on how the function works. LSAT scores and GPA are weighed heavily in law school, with LSAT being more imporant. Based on that, an LSAT score above the median of a school is a few tenths of a GPA. Although law school admissions is very numbers-based, there is a hollistic element which is factored into the function, allowing a little leeway in both the LSAT and GPA.
    
        After creating match function, I wanted to add a little bit more to the project. I wantd to add a description to each school to further help users of the project understand a little bit more about it. There were no datasets or free API's that contained information about this, and the website that had the most encompassing information about different law schools (other that wiki) did not want any webscraping. I decided to use a free GPT API to create a description of each law school, which I added to the list of information about each school in the dictionary.
    
        Once I had all of the information I wanted about each school saved in the dictioanry, I saved it as a CSV file. I then created a database table based on the CSV file that stored all of the school information. The database schema consists of a single table called schools, and had columns based on the information stored in the key list of the dictionary.

    Frontend/Backend:
        Once the database was set up, my next focus was on the interface of the project. Initially, I considered using React to implement a dynamic filtering system that wouldn’t require page refreshes. However, due to the steep learning curve, I opted for Flask, which was simpler and allowed easy integration of JavaScript. I began by establishing a function, get_db_connection(), to connect to the database.
        
        Next, I wanted to create a user-driven test to filter and match them with appropriate law schools. To do this, I transferred the code from my Jupyter notebook into the app.py file. This involved setting up the database connection, running the match function, and saving the resulting matches (which included comprehensive details about each school) into a list. I then used Jinja to access this list in the corresponding HTML templates.
    
        I used two templates: welcome.html and results.html. The welcome.html page contains a form where users input their stats. The results.html page processes these inputs as parameters for the match function and displays the results as static cards.
    
        For the actual filtering, I primarily used JavaScript in the index.html page. This page includes a sidebar where users input their minimum GPA, LSAT score, and preferred state. The main area of the page dynamically generates clickable cards with information about schools that meet the user's criteria. These cards display key details such as tuition, acceptance rate, and average LSAT scores. Additionally, each card features a "Learn More" button that opens a modal containing more detailed information about the school.
    
        I chose to use a modal for the detailed view rather than creating a new URL for each school to avoid unnecessary Flask routes and urls. The modal displays school information in a table format for easier readability. All JavaScript functionality, including the dynamic creation of cards and modal handling, is contained within the index.js file.
    
        When the user submits their inputs, I create a query (similar to SQL) to retrieve schools that match the given criteria. In app.py, I wrote a function that serves acts similar to an API for the JavaScript code. Using SQL, this function queries the database and returns a JSON file containing the relevant school data. Since the data was initially formatted as a dictionary, JSON was a convenient format for parsing with JavaScript. The HTML page then dynamically generates cards for each school in the JSON response, and the "Learn More" button populates the modal with additional details.
    
        To enhance the aesthetics of the website, I incorporated various Bootstrap icons and styles. I also added custom CSS to make the cards and buttons more interactive, such as changing the color them when hovered over.

Backend:
Flask: Foundation of all pages, renders jinja for static page.
Jinja: Used to render static cards to html
Javascript: Used to remder dynamic cards
SQLite: Used to access database

Data Science:
Jupyter notebook: Used to create law school database through the pandas library
GroqCloud: Used GPT to generation descriptions for each law school

Database Design

The database schema consists of a single table called schools. The table includes the following columns:
name: The name of the law school.
group_type: A value indicating whether the school is public or private.
location: The location of the school.
lsat: The average LSAT score for admitted students.
gpa: The average GPA for admitted students.
acceptance_rate: The percentage of applicants accepted by the school.
size: The number of students enrolled at the school.
tuition: The in-state tuition fee.
oos_tuition: The out-of-state tuition fee.
description: A brief description of the school.
This schema was chosen to provide a comprehensive set of attributes for each law school, while keeping the structure simple and efficient for querying.
Application Flow

Future Improvements:
    For future improvements I plan to add a bookmarkk feature that allows users to bookmark law schools whih can be viable in another page. I also want to update the database to prove links for each school which can be viewed in the "learn more" modla. I also want to add more filtering options like tuition, public/private. I can also update the database to include more infomraiotn like bar passage rates, the city of the schools, and possibly pictures of the schools to be included on the cards.
