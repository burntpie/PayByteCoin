import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { mineNewBlock } from "../../firebase/firebase";
import "./PendingTransactionCard.css"
import SingleTransactionRecordCard from '../singleTransactionRecordCard/SingleTransactionRecordCard';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import ConstructionIcon from '@mui/icons-material/Construction';

const PendingTransactionCard = (allPendingTransactions) => {

  const navigate = useNavigate();
  const pendingTransactionsLength = Object.keys(allPendingTransactions).length;
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleMining = async () => {
    if (difficulty <= 0 || difficulty > 6) {
      alert("Please choose a difficulty of 1-5!");
    } else if (pendingTransactionsLength === 0 || pendingTransactionsLength === 1 ) {
      alert("Insufficient pending transactions, Minimum amount is 2!");
    } else {
      setLoading(true);
      const senderRecipientPublicKeyPairTransaction = [];
      const pendingTransactionsHex = [];
      Object.entries(allPendingTransactions).map(([key, transaction]) => {
        pendingTransactionsHex.push(transaction.signed_transaction_hex);
        senderRecipientPublicKeyPairTransaction.push({
          sender: transaction.sender,
          recipient: transaction.recipient,
          transaction_amount: transaction.transaction_amount
        });
      });
      await mineNewBlock(pendingTransactionsHex, senderRecipientPublicKeyPairTransaction, difficulty);
      setLoading(false);
      alert("New Block has been successfully mined and added to the Blockchain!");
      refreshPage();
    }
    return;
  }

  const refreshPage = () => {
    navigate(0);
  }

  return (
    <div className="pending-transaction-card">
      <div className="pending-transaction">
        <div className="pending-transaction-difficulty-mine">
          <h2>Pending Transactions</h2>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '22ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              id="outlined-helperText"
              label="Difficulty"
              defaultValue="1"
              helperText="Enter Mining Difficulty (1-5)"
            />
          </Box>
          <LoadingButton
            onClick={() => {handleMining()}}
            loading={loading}
            size="medium"
            variant="contained"
            loadingPosition="end"
            endIcon={<ConstructionIcon />}
            style={{maxWidth: '200px', maxHeight: '70px', minWidth: '200px', minHeight: '70px'}}
          >
            Mine new block
          </LoadingButton>
        </div>

        {Object.entries(allPendingTransactions).map(([index, transaction]) => (
          <SingleTransactionRecordCard
          {...transaction}
          index={index}
          key={index}
          />
        ))}
        
      </div>
    </div>
  )
}

export default PendingTransactionCard