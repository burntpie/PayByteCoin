# PayByteCoin
A payment platform powered by blockchain.
<br><br>

Login Page
![](frontend/src/assets/images/markdown%20images/paybytecoin%20login.jpg)
<br><br>

Main Dashboard - Profile, Transfer and Pending Transactions sections
![](frontend/src/assets/images/markdown%20images/paybytecoin.jpg)
<br><br>

Blockchain section in Dashboard
![](frontend/src/assets/images/markdown%20images/paybytecoin%20blockchain.jpg)
<br><br>

Expanded Block - Details within Block Header and Transactions are shown
![](frontend/src/assets/images/markdown%20images/paybytecoin%20expanded%20block.jpg)
<br><br>

Transaction Records section - All completed transactions recorded in Blockchain shown
![](frontend/src/assets/images/markdown%20images/paybytecoin%20transaction%20records.jpg)
<br><br>

## Setup 
- ### Firebase API Key
    - Setup a Firebase & Firestore Project
    - Copy API Key from (Project Overview > Project Settings > Add App (WEB) > Firebase Configuration)
    - Paste API Key to the following field under [firebase.js](frontend/src/firebase/firebase.js)
        ``` 
        const firebaseConfig = {
            apiKey: "",
            authDomain: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: ""
        }; 
        ```
    - Collections & Documents under Firestore do not need to be configured - except for Blockchain as Genesis Block has to be statically configured
    <br><br>
- ### Node Modules
    - Install npm packages under package.json & package-lock.json
        ```
        cd .\frontend\
        npm i 
        ```
    - If npm install does not work, the following modules have to be installed manually
        - firebase
        - material ui/lab
        - material ui/material
        - material ui/icons-material
        - fontsource/roboto
    <br><br>
- ### Blockchain
    - Two copies of the Blockchain are kept seperately in backend [blockchain.csv](backend/blockchain/blockchain.csv) & frontend (in Firestore)
        - backend
            - Check that first line of blockchain.csv has Genesis Block
                ```
                424cdcd9228886022373b5868f450863b84099a39f464d...
                ```
            - Change to another Block (Hexadecimal Format && len(Genesis_Block) > 64) **only if you wish to**
            - Check that there is empty newline after each block in order for crytodome.py to read and write to blockchain.csv file
        - frontend
            - Configure Firestore collection (Firebase Console > Firestore Database > Start Collection)
                - Parent Path: /
                - Collection ID: blockchain
            - Add Document - For Genesis Block
                - Document ID: Auto-ID
                - Fields
                    - difficulty (number): 0
                    - merkle_root_hash (string): "null"
                    - mining_datetime (string): "18/11/2022, 12:00:00" - **set to earliest point of datetime before any other blocks**
                    - new_block_hex (string) - **input hexadecimal string of Genesis Block here**
                    - nonce (number): 0
                    - previous_block_hash (string): "null"
                    - transactions (array) - **leave this array empty**
    <br><br>
- ### Virtual Enviroment
    - Tested and Developed on Python 3.10.6
    - Create venv
        - ```
            cd .\backend\
            python -m venv venv
            ```
    - Start venv
        - ```
            .\venv\Scripts\activate
            ```
    - Pip install
        - ```
            pip install -r requirements.txt
            /OR/
            python -m pip install -r requirements.txt
            ```
    <br><br>




## Run PayByteCoin
- ### Backend
    - ```
        cd .\backend\
        .\venv\Scripts\activate

        python app.py
        /OR/
        flask run
        ```
- ### Frontend
    - ```
        cd .\frontend\
        npm start
        ```
- ### React Webpage will be hosted on http://localhost:3000/
    - Create New Account
        - Enter Username, Email, Password
            - Public-Private Key pair will be generated for User once registered
            - User's credentials are added to Firebase Authentication
            - User is added to 'users' collection in Firestore Database
        - Ideally there will a admin account
            - Byte Coin can be statically added to this admin account's accountBalance (as no Mining Rewards are given, only way to "introduce" new coins to the economy)
            - Once added, Admin can freely transfer Byte Coins to other users
    <br><br>

## PayByteCoin Usage
- ### Password of account needs to be inputted for a transaction (making a transfer of ByteCoin)
    - password of user's account is used to encrypt user's private key
    - user's decrypted private key is needed to sign a transaction
    - Note: wrong password entered will cause an error, transaction will fail
    <br><br>
- ### Minimum Number of 2 Pending Transactions to mine a new block
    - Due to calculation of Merkle Root Hash
    - Enforced in Frontend
    - No Maximum Limit of Number of Transactions implemented (but computation time & python's recursion limit should be considered)
    <br><br>

## Additional Notes / Improvement Points
- ### Double Spending Issue
    - Possibility of Double Spending -> Leading to negative balance in account balance
    - Eg Alwin has 100 Bytecoins, he sends Bob 100 Bytecoins in one transaction (transaction A)
    - transaction A has not been mined to a Block
    - ALwin sends Alice 50 Bytecoins in another transaction (transaction B)
    - transaction A & transaction B are mined into a new Block and Block is added to Blockchain
    - Alwin has double-spent, and now has -50 Bytecoin account balance
    <br><br>
- ### Cloud Firestore storage of datetime objects
    - Currently transaction and mining datetime is generated by backend using python datetime library, and stored as a sting ("%d/%m/%Y, %H:%M:%S" format) in cloud firestore
    - May lead to ordering errors when fetching pending transactions/blocks in blockchain/transaction records as documents are ordered by their datetime string (eg "01/01/2023, 00:00:01" will be ordered higher than "31/12/2022, 23:59:59" even though the latter is earlier)
    - Solution: store datetime as a datetime object in firestore, which itself needs to be generated in frontend, whenever a new transaction/block is generated
    <br><br>