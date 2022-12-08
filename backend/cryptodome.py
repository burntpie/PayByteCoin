
# _________________________________________________ Import Libraries _____________________________________________________________________________

from collections import OrderedDict
from datetime import datetime
import hashlib, binascii, csv

# _________________________________________________ Import PKI Libraries _________________________________________________________________________

import Cryptodome.Random
from Cryptodome.Hash import SHA256
from Cryptodome.PublicKey import RSA
from Cryptodome.Signature import PKCS1_v1_5

# _________________________________________________ Generate Client Key Functions ________________________________________________________________

def generate_client_key(client_passphrase):
    key = RSA.generate(2048)
    private_key_bin = key.export_key(format='DER', passphrase=client_passphrase, pkcs=8, protection="scryptAndAES128-CBC")
    public_key_bin = key.publickey().export_key(format='DER')

    private_key_hex = binascii.hexlify(private_key_bin).decode('ascii')
    public_key_hex = binascii.hexlify(public_key_bin).decode('ascii')

    return private_key_hex, public_key_hex

# _________________________________________________ Make Signed Transaction Functions ____________________________________________________________

def make_signed_transaction(sender_private_key, sender_passphrase, recipient_public_key, transaction_amount):
    private_key_bin = binascii.unhexlify(sender_private_key)
    key = RSA.import_key(private_key_bin, passphrase=sender_passphrase)
    signature = PKCS1_v1_5.new(key)

    transcation = OrderedDict({
        'sender': binascii.hexlify(key.publickey().exportKey(format='DER')).decode('ascii'),
        'recipient': recipient_public_key,
        'transaction_amount': transaction_amount,
        'transaction_datetime' : datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
    })

    hash = SHA256.new(str(transcation).encode('ascii'))
    signed_transcation = binascii.hexlify(signature.sign(hash)).decode('ascii')

    return transcation, signed_transcation

# _________________________________________________ Mine Block Functions __________________________________________________________________________

def mine_new_block_header_hash(pending_transactions, difficulty):
    with open('./blockchain/blockchain.csv', 'r', newline='') as file:
        reader = csv.reader(file)
        last_block_header_hash = list(reader)[-1][0][:64]

    merkle_root_hash = find_merkle_root(pending_transactions)
    mining_datetime = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
    prefix = '0' * difficulty

    for nonce in range(4294967296):
        new_block_header = OrderedDict({
            'previous_block_hash' : last_block_header_hash,
            'merkle_root_hash' : merkle_root_hash,
            'mining_datetime' : mining_datetime,
            'difficulty' : difficulty,
            'nonce' : nonce
        })

        digest = sha256(str(new_block_header))
        if digest.startswith(prefix):
            print(f"Found {digest = } after {nonce = } iterations")
            new_block = attach_block_local(digest, pending_transactions)

            new_block_header["transactions"] = pending_transactions

            return new_block_header, new_block

    raise Exception("Nonce not found after 4294967296 (2**32) iterations")


def find_merkle_root(input_list):
    
    return find_root_binary_tree([sha256(input) for input in input_list])


def find_root_binary_tree(input_list):
    if len(input_list) == 2:
        return sha256(input_list[0] + input_list[1])
    elif len(input_list) % 2 == 1:
        input_list.append(input_list[-1])
    else:
        pass

    return find_root_binary_tree([sha256(odd + even) for odd, even in zip(input_list[0::2], input_list[1::2])])


def attach_block_local(digest, pending_transactions):
    new_block = digest + "".join(pending_transactions)

    with open('./blockchain/blockchain.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([new_block])

    return new_block

# _________________________________________________ Hepler Functions _____________________________________________________________________________

def sha256(message):
    return hashlib.sha256(message.encode('ascii')).hexdigest()

