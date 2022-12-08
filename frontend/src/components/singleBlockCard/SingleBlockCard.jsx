import React, { useState } from 'react'
import "./SingleBlockCard.css"
import Switch from '@mui/material/Switch';

const SingleBlockCard = ({index, difficulty, merkle_root_hash, mining_datetime, new_block_hex, nonce, previous_block_hash, transactions}) => {

  const transactionObj = {...transactions};
  const [checked, setChecked] = useState(false);

  const handleExpand = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className='single-block-card'>
      <div className='single-block-expand-switch'>
        <Switch
          checked={checked}
          onChange={handleExpand}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>

      { checked ? 
          <div>
            <p><b><u>Block Header</u></b></p>
            <p><b>&emsp;&emsp;Previous Block Hash: </b>{previous_block_hash}</p>
            <p><b>&emsp;&emsp;Merkle Root Hash: </b>{merkle_root_hash}</p>
            <p><b>&emsp;&emsp;Mining Datetime: </b>{mining_datetime}</p>
            <p><b>&emsp;&emsp;Difficulty: </b>{difficulty}</p>
            <p><b>&emsp;&emsp;Nonce: </b>{nonce}</p>
            <p><b><u>Transactions</u></b></p>
            {Object.entries(transactionObj).map(([key, transaction]) => (
                <h4 key={key}><b>&emsp;&emsp;Transaction {key}: </b>{transaction}</h4>
            ))}
            <h3><b>Block {index} <i>(Hex)</i>: </b>{new_block_hex}</h3>
          </div>
        :
          <h3><b>Block {index}: </b>{new_block_hex}</h3>
      }
    </div>
  )
}

export default SingleBlockCard