from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import datetime

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this to a random secret key
jwt = JWTManager(app)

users = []


@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user = {
        "id": len(users) + 1,
        "username": data['username'],
        "email": data['email'],
        "password": data['password']
    }
    users.append(user)
    return jsonify(user), 201

@app.route('/auth', methods=['POST'])
def authenticate_user():
    data = request.get_json()
    user = next((u for u in users if u['username'] == data['username'] and u['password'] == data['password']), None)
    if user:
        expires = datetime.timedelta(hours=1)
        access_token = create_access_token(identity=user['id'], expires_delta=expires)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        return jsonify(user), 200
    return jsonify({"msg": "User not found"}), 404

@app.route('/users/<int=user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        user['username'] = data['username']
        user['email'] = data['email']
        user['password'] = data['password']
        return jsonify(user), 200
    return jsonify({"msg": "User not found"}), 404

@app.route('/users/<int=user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    global users
    users = [u for u in users if u['id'] != user_id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
