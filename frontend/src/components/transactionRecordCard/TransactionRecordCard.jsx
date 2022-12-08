import React from 'react'
import "./TransactionRecordCard.css"
import SingleTransactionRecordCard from '../singleTransactionRecordCard/SingleTransactionRecordCard';

const TransactionRecordCard = (allTransactionRecords) => {
  return (
    <div className="transaction-record-card">
      <div className="transaction-record">
        <h2>Transaction Records</h2>
      </div>
      {Object.entries(allTransactionRecords).map(([index, transaction]) => (
          <SingleTransactionRecordCard
          {...transaction}
          index={index}
          key={index}
          />
        ))}
    </div>
  )
}

export default TransactionRecordCard