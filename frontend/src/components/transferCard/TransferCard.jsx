import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { makeTransaction } from '../../firebase/firebase';
import "./TransferCard.css"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';

const TransferCard = ({name, privateKey, publicKey, accountBalance, ...allOtherUser}) => {

  const navigate = useNavigate();
  const keys = Object.keys(allOtherUser);

  const [recipient, setRecipient] = useState('');
  const [recipientPublicKey, setRecipientPublicKey] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (recipient === "") {
      alert("Please Choose a Recipient!");
    } else if (transferAmount === 0) {
      alert("Please Choose a Correct Amount!");
    } else if (password === "") {
      alert("Please Enter your Password!");
    } else if (transferAmount > accountBalance) {
      alert("Acount Balance is insufficient!");
    } else {
      setLoading(true);
      await makeTransaction(privateKey, password, recipientPublicKey, transferAmount);
      setLoading(false);
      alert("Transaction has been added to Pending Transactions!");
      refreshPage();
    }
    return;
  }

  const refreshPage = () => {
    navigate(0);
  }

  useEffect(() => {
    setRecipientPublicKey(allOtherUser[recipient]);
  }, [recipient]);


  return (
    <div className="transfer-card">
      <div className="transfer">
        <h2>Transfer</h2>
        <div className="recipient-transfer-amount">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="recipient-table">Recipient</InputLabel>
              <Select
                labelId="recipient-table"
                label="Recipient"
                onChange={(e) => setRecipient(e.target.value)}
                value={recipient}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {keys.map(user => (
                  <MenuItem value={user} key={user}>{user}</MenuItem>
                ))}
              </Select>
            <FormHelperText>Choose a Recipient</FormHelperText>
          </FormControl>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '21ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              onChange={(e) => setTransferAmount(parseInt(e.target.value))}
              id="outlined-helperText"
              label="ByteCoins"
              defaultValue="0"
              helperText="Choose Amount to Transfer"
            />
          </Box>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '21ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              id="outlined-helperText"
              label="Password"
              helperText="Enter Password"
            />
          </Box>
          <LoadingButton
            onClick={() => {handleTransfer()}}
            loading={loading}
            size="medium"
            variant="contained"
            loadingPosition="end"
            endIcon={<SendIcon />}
            style={{maxWidth: '150px', maxHeight: '70px', minWidth: '150px', minHeight: '70px'}}
          >
            Transfer
          </LoadingButton>
        </div>
        {(recipient !== '' && recipientPublicKey !== '')? <p><b>{recipient}'s Public Key: </b>{recipientPublicKey}</p> : <></>}
      </div>
    </div>
  )
}

export default TransferCard