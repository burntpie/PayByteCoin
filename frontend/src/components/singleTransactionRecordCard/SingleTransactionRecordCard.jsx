import React, { useState } from 'react'
import "./SingleTransactionRecordCard.css"
import Switch from '@mui/material/Switch';

const SingleTransactionRecordCard = ({index, recipient, sender, signed_transaction_hex, transaction_amount, transaction_datetime}) => {
  
  const [checked, setChecked] = useState(false);

  const handleExpand = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className='single-transaction-card'>
      <div className='single-transaction-expand-switch'>
        <Switch
          checked={checked}
          onChange={handleExpand}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>

      { checked ? 
          <div>
            <p><b>Sender: </b>{sender}</p>
            <p><b>Recipient: </b>{recipient}</p>
            <p><b>ByteCoin(s): </b>{transaction_amount}</p>
            <p><b>Transaction Datetime: </b>{transaction_datetime}</p>
            <h4><b>Signed-Transaction {index} <i>(Hex)</i>: </b>{signed_transaction_hex}</h4>
            </div>
          :
            <h4><b>Signed-Transaction {index}: </b>{signed_transaction_hex}</h4>
      }
    </div>
  )
}

export default SingleTransactionRecordCard