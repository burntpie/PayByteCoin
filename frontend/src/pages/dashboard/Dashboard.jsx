import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase/firebase";
import { query, collection, getDocs, where, orderBy } from "firebase/firestore";
import "./Dashboard.css";
import ProfileCard from "../../components/profileCard/ProfileCard";
import TransferCard from "../../components/transferCard/TransferCard";
import PendingTransactionCard from "../../components/pendingTransactionCard/PendingTransactionCard";
import TransactionRecordCard from "../../components/transactionRecordCard/TransactionRecordCard";
import BlockchainCard from "../../components/blockchainCard/BlockchainCard";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userObj, setUserObj] = useState();
  const [allOtherUsers, setAllOtherUsers] = useState();
  const [pendingTransactions, setPendingTransactions] = useState();
  const [completedTransactions, setCompletedTransactions] = useState();
  const [blockchain, setBlockchain] = useState();
  const navigate = useNavigate();
  
  const fetchProfile = async () => {
    try {
      const queryRef = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(queryRef);
      const data = doc.docs[0].data();
      setUserObj({
        name:data.name,
        privateKey:data.privateKey,
        publicKey:data.publicKey,
        accountBalance:data.accountBalance
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchAllOtherUsers = async () => {
    try {
      const queryRef = query(collection(db, "users"), where("uid", "!=", user?.uid));
      const querySnapshot  = await getDocs(queryRef);
      const users = {};
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        users[data.name] = data.publicKey;
        // console.log(doc.id, " => ", doc.data());
      });
      setAllOtherUsers(users);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching ALL OTHER users data");
    }
  };

  const fetchPendingTransactions = async () => {
    try {
      const queryRef  = query(collection(db, "pending-transaction"), orderBy("transaction_datetime"));
      const querySnapshot  = await getDocs(queryRef);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        transactions.push(data);
        // console.log(doc.id, " => ", doc.data());
      });
      setPendingTransactions(transactions);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching pending transactions");
    }
  };

  const fetchTransactionRecords = async () => {
    try {
      const queryRef  = query(collection(db, "transaction-record"), orderBy("transaction_datetime"));
      const querySnapshot  = await getDocs(queryRef);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        transactions.push(data);
        // console.log(doc.id, " => ", doc.data());
      });
      setCompletedTransactions(transactions);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching transaction records");
    }
  };

  const fetchBlockchain = async () => {
    try {
      const queryRef  = query(collection(db, "blockchain"), orderBy("mining_datetime"));
      const querySnapshot  = await getDocs(queryRef);
      const blocks = [];
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        blocks.push(data);
        // console.log(doc.id, " => ", doc.data());
      });
      setBlockchain(blocks);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching blockchain");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchProfile();
    fetchAllOtherUsers();
    fetchPendingTransactions();
    fetchTransactionRecords();
    fetchBlockchain();
  }, [user, loading]);


  return (
    <div className="dashboard">
      <div className="header">
        <h1>PayByteCoin</h1>
        <Button className="dashboard__btn" variant="outlined" endIcon={<LogoutIcon />} onClick={logout}>
          Logout
        </Button>
      </div>
      <div className="profile-transfer table">
          <ProfileCard
            {...userObj}
          />
          <TransferCard
            {...userObj}
            {...allOtherUsers}
          />
      </div>
      <div className="pending-transaction table">
          <PendingTransactionCard
            {...pendingTransactions}
          />
      </div>
      <div className="blockchain table">
          <BlockchainCard
          {...blockchain}
          />
      </div>
      <div className="transaction-record table">
          <TransactionRecordCard
          {...completedTransactions}
          />
      </div>
    </div>
  );
}

export default Dashboard;
