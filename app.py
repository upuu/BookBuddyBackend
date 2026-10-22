from flask import Flask, jsonify, request, render_template_string
import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD

app = Flask(__name__)

# Mock Dataset representing user ratings for books
ratings_data = {
    'User': ['Alice', 'Alice', 'Bob', 'Bob', 'Charlie', 'Charlie', 'Diana', 'Diana'],
    'Book': ['The Hobbit', 'Dune', 'Atomic Habits', 'Deep Work', 'Foundation', 'The Hobbit', 'Project Hail Mary', 'Deep Work'],
    'Rating': [5, 5, 5, 5, 4, 3, 5, 4]
}

df_ratings = pd.DataFrame(ratings_data)

# Book metadata dictionary
book_info = {
    'The Hobbit': {'author': 'J.R.R. Tolkien', 'genre': 'Fantasy'},
    'Dune': {'author': 'Frank Herbert', 'genre': 'Sci-Fi'},
    'Project Hail Mary': {'author': 'Andy Weir', 'genre': 'Sci-Fi'},
    'Foundation': {'author': 'Isaac Asimov', 'genre': 'Sci-Fi'},
    'Atomic Habits': {'author': 'James Clear', 'genre': 'Self-Help'},
    'Deep Work': {'author': 'Cal Newport', 'genre': 'Self-Help'}
}

# HTML Frontend Template served directly by Flask
UI_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>BookBuddy - Alpha Prototype</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f6f9; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #2c3e50; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        select, button { padding: 10px; font-size: 16px; margin-right: 10px; border-radius: 4px; border: 1px solid #ccc; }
        button { background: #3498db; color: white; border: none; cursor: pointer; }
        button:hover { background: #2980b9; }
        ul { list-style: none; padding: 0; }
        li { background: #ecf0f1; margin: 8px 0; padding: 12px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>BookBuddy Alpha Prototype</h1>
    <div class="card">
        <h3>Personalized Recommendation Engine (SVD Model)</h3>
        <label for="userSelect">Select User Profile:</label>
        <select id="userSelect">
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
            <option value="Charlie">Charlie</option>
            <option value="Diana">Diana</option>
        </select>
        <button onclick="getRecommendations()">Get Recommendations</button>
    </div>

    <div class="card" id="resultsCard" style="display:none;">
        <h3>Recommended Books for <span id="userName"></span>:</h3>
        <p><strong>Algorithm Used:</strong> <span id="algoName" style="color: #27ae60;"></span></p>
        <ul id="bookList"></ul>
    </div>

    <script>
        async function getRecommendations() {
            const user = document.getElementById('userSelect').value;
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user })
            });
            const data = await response.json();

            document.getElementById('userName').innerText = data.user;
            document.getElementById('algoName').innerText = data.algorithm;

            const list = document.getElementById('bookList');
            list.innerHTML = '';
            data.recommendations.forEach(book => {
                let li = document.createElement('li');
                li.innerHTML = `<strong>${book.title}</strong> by ${book.author} <em>(${book.genre})</em>`;
                list.appendChild(li);
            });

            document.getElementById('resultsCard').style.display = 'block';
        }
    </script>
</body>
</html>
"""


# Route: Serve the UI Dashboard
@app.route('/')
def home():
    return render_template_string(UI_HTML)


# Route: API endpoint for books
@app.route('/api/books', methods=['GET'])
def get_books():
    return jsonify({
        "status": "success",
        "books": [{"title": k, **v} for k, v in book_info.items()]
    })


# Route: SVD Recommendation API
@app.route('/api/recommendations', methods=['POST'])
def get_svd_recommendations():
    req_data = request.get_json()
    target_user = req_data.get('user', 'Alice')

    user_item_matrix = df_ratings.pivot_table(index='User', columns='Book', values='Rating').fillna(0)

    svd = TruncatedSVD(n_components=2, random_state=42)
    matrix_reduced = svd.fit_transform(user_item_matrix)

    predicted_matrix = np.dot(matrix_reduced, svd.components_)
    df_predicted = pd.DataFrame(predicted_matrix, index=user_item_matrix.index, columns=user_item_matrix.columns)

    if target_user in df_predicted.index:
        user_vector = df_predicted.loc[target_user]
        sorted_books = user_vector.sort_values(ascending=False).index.tolist()
    else:
        sorted_books = list(book_info.keys())

    recommended_books = []
    for book in sorted_books[:3]:
        recommended_books.append({
            "title": book,
            "author": book_info[book]['author'],
            "genre": book_info[book]['genre']
        })

    return jsonify({
        "status": "success",
        "algorithm": "SVD Matrix Factorization (scikit-learn)",
        "user": target_user,
        "recommendations": recommended_books
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)