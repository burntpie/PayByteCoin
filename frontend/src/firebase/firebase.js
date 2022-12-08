import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, updateDoc, doc, increment, deleteDoc } from "firebase/firestore";
import callApi from "../utils/callAPI";

const firebaseConfig = {
  // ----------------------- ADD Firebase api key here -----------------------
  // apiKey: "",
  // authDomain: "",
  // projectId: "",
  // storageBucket: "",
  // messagingSenderId: "",
  // appId: "",
  // measurementId: ""
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    var endpoint = "generate-client";
    var inputBody = {
      client_name: name,
      client_passphrase: password
    };
    const serverRes = await callApi(endpoint, inputBody);

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      privateKey: serverRes.private_key,
      publicKey: serverRes.public_key,
      accountBalance: 0
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};


const makeTransaction = async (senderPrivateKey, senderPassword, recipientPublicKey, transactionAmount) => {
  try {
    var endpoint = "make-transaction";
    var inputBody = {
      sender_private_key: senderPrivateKey,
      sender_passphrase: senderPassword,
      recipient_public_key: recipientPublicKey,
      transaction_amount: transactionAmount
    };
    const serverRes = await callApi(endpoint, inputBody);

    await addDoc(collection(db, "pending-transaction"), serverRes);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const mineNewBlock = async (pendingTransactionsHex, senderRecipientPublicKeyPairTransaction, difficulty) => {
  try {
    // send API call to mine-block, then add to blockchain collection
    var endpoint = "mine-block";
    var inputBody = {
      pending_transactions: pendingTransactionsHex,
      difficulty: difficulty
    };
    const serverRes = await callApi(endpoint, inputBody);
    await addDoc(collection(db, "blockchain"), serverRes);


    // update sender & recipient accountBalance in database
    for (var key in senderRecipientPublicKeyPairTransaction) {
      const transaction = senderRecipientPublicKeyPairTransaction[key];
      var transactionAmount = parseInt(transaction.transaction_amount);

      var queryRefSender = query(collection(db, "users"), where("publicKey", "==", transaction.sender));
      var querySnapshotSender = await getDocs(queryRefSender);
      var idSender = querySnapshotSender.docs[0].id;

      const senderRef = doc(db, "users", idSender);
      await updateDoc(senderRef, {
        accountBalance: increment(transactionAmount * -1)
      });

      var queryRefRecipient = query(collection(db, "users"), where("publicKey", "==", transaction.recipient));
      var querySnapshotRecipient = await getDocs(queryRefRecipient);
      var idRecipient = querySnapshotRecipient.docs[0].id;

      const recipientRef = doc(db, "users", idRecipient);
      await updateDoc(recipientRef, {
        accountBalance: increment(transactionAmount)
      });
    }

    // transfer pending-transactions to transaction-record
    const pendingTransactionRef = collection(db, "pending-transaction");
    const pendingTransactionSnapshot = await getDocs(pendingTransactionRef);
    for (var index in pendingTransactionSnapshot.docs) {
      var document = pendingTransactionSnapshot.docs[index]
      await addDoc(collection(db, "transaction-record"), document.data());
      await deleteDoc(doc(db, "pending-transaction", document.id));
    }

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


export { auth, db, logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, logout, makeTransaction, mineNewBlock };