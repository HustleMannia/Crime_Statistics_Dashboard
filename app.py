from flask import Flask, jsonify, render_template
from crime_data import crime_data  # Assuming crime_data is your data file

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_crime_data/<year>', methods=['GET'])
def get_crime_data(year):
    # Check if the year exists in the crime data
    if year in crime_data:
        # Combine states and uts into one list
        data = crime_data[year]["states"] + crime_data[year]["uts"]
        print(data)  # Debugging line to see the structure of the data
        return jsonify(data)  # Send combined data as JSON
    else:
        return jsonify({"error": "Data not found for the selected year"}), 404

if __name__ == '__main__':
    app.run(debug=True)
