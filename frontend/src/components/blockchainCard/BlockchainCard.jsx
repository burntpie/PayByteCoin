import React from 'react'
import "./BlockchainCard.css"
import SingleBlockCard from '../singleBlockCard/SingleBlockCard'

const BlockchainCard = (blockchain) => {
  return (
    <div className="blockchain-card">
      <div className="blockchain">
        <h2>Blockchain</h2>
      </div>
      {Object.entries(blockchain).map(([index, block]) => (
        <SingleBlockCard
          {...block}
          index={index}
          key={index}
        />
      ))}
    </div>
  )
}

export default BlockchainCard