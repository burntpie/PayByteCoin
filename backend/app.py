from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from cryptodome import *

app = Flask(__name__)
cors = CORS(app)

@app.route('/', methods=['GET'])
def home():
    return "Flask server is currently running on localhost:5000."


@app.route('/generate-client', methods=['POST'])
def generate_client():
    try:
        new_client = request.json
        client_name, client_passphrase = new_client["client_name"], new_client["client_passphrase"]
        private_key_hex, public_key_hex = generate_client_key(client_passphrase)

        return_json = {
            "client_name" : client_name,
            "private_key" : private_key_hex,
            "public_key" : public_key_hex
        }

        return json.dumps(return_json), 200, {'Content-Type':'application/json'}
    
    except Exception as err:
        return jsonify({'error': err}), 500


@app.route('/make-transaction', methods=['POST'])
def make_transaction():
    try:
        transaction = request.json
        sender_private_key, sender_passphrase, recipient_public_key, transaction_amount = transaction["sender_private_key"], transaction["sender_passphrase"], transaction["recipient_public_key"], transaction["transaction_amount"]
        
        transcation_json, signed_transaction_hex = make_signed_transaction(sender_private_key, sender_passphrase, recipient_public_key, transaction_amount)
        transcation_json["signed_transaction_hex"] = signed_transaction_hex

        return json.dumps(transcation_json), 200, {'Content-Type':'application/json'}

    except Exception as err:
        return jsonify({'error': err}), 500


@app.route('/mine-block', methods=['POST'])
def mine_block():
    try:
        input_json = request.json

        pending_transactions, difficulty = input_json["pending_transactions"], int(input_json["difficulty"])

        new_block_json, new_block_hex = mine_new_block_header_hash(pending_transactions, difficulty)
        new_block_json["new_block_hex"] = new_block_hex

        return json.dumps(new_block_json), 200, {'Content-Type':'application/json'}

    except Exception as err:
        return jsonify({'error': err}), 500


if __name__ == '__main__':
    app.run(debug=True)