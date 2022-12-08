import React from 'react'
import "./ProfileCard.css"

const ProfileCard = ({name, privateKey, publicKey, accountBalance}) => {

  return (
    <div className="profile-card">
      <div className="profile">
        <h2>{name}'s Profile</h2>
        <h1><i>ByteCoin Balance: {accountBalance}</i></h1>
        <p><b>Public Key: </b>{publicKey}</p>
        <p><b>Private Key (encrypted with password): </b>{privateKey}</p>
      </div>
    </div>
  )
}

export default ProfileCard