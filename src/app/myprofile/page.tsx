'use client'
import React, { useState } from 'react'
import { useUser } from '../providers/userProvider'
import { concatAddress } from '../utils/utilsFunctions'
import { doc, setDoc } from 'firebase/firestore'
import initializeFirebaseClient from '../lib/initFirebase'

type Props = {}

const MyProfile = (props: Props) => {
    const userProvider = useUser()

    const [isEditing, setIsEditing] = useState<Boolean>(false)
    const [editableEmail, setEditableEmail] = useState<string>(userProvider?.user?.email || "");
    const [editablePostAddress, setEditablePostAddress] = useState<string>(userProvider?.user?.post_address || "");

    const {auth,db} = initializeFirebaseClient()

    const saveChanges = async () => {
        if (userProvider?.user?.wallet_address) {
            const userRef = doc(db, "users", userProvider.user.wallet_address);
    
            // Mise à jour de l'utilisateur dans Firestore
            await setDoc(userRef, { email: editableEmail, post_address: editablePostAddress }, { merge: true });
    
            // Mise à jour de l'utilisateur dans le contexte global
            userProvider.updateUser({
                ...userProvider.user,
                email: editableEmail,
                post_address: editablePostAddress
            });
        }
        setIsEditing(false);
    }

  return (  
    <div className='p-4 flex flex-col items-center'>
        <h2 className='text-xl font-semibold'>My profile</h2>
        {
        isEditing ?
        <button className="bg-black rounded-full text-white px-2 py-1"  onClick={()=>{saveChanges()}}>Save changes ✅</button>
        :
        <button className="bg-black rounded-full text-white px-2 py-1" onClick={()=>{setIsEditing(!isEditing)}}>edit ✍️</button>
        }
        {/* crypto wallet */}
        <h3 className='font-semibold pt-4'>My blockchain team wallet (unchangeable)</h3>
        <p className='text-sm text-gray-500'>This the the wallet address on which you will receive your digitals assets</p>
        <p className='border rounded-full px-4 py-1 text-gray-500'>{concatAddress(userProvider?.user?.wallet_address) }</p>
        {/* email */}
        <h3 className='font-semibold pt-4'>My contact email</h3>
        <p className='text-sm text-gray-500'>Has to be the same you use to connect to blockchain team app</p>
        <p className='text-sm text-gray-500'>Requiered to buy art on blockchain team. For billing purpose</p>
        {
        isEditing ? 
        <input
            type="email"
            value={editableEmail}
            placeholder={editableEmail == "" ? "set your email" : editableEmail}
            onChange={(e) => setEditableEmail(e.target.value)}
            className="border rounded-full px-4 py-1"
        />
        :
        <p className='border rounded-full px-4 py-1 text-gray-500'>{userProvider?.user?.email == "" ? "no email provided" : userProvider?.user?.email}</p>
        }
        {/* phone */}
        <h3 className='font-semibold pt-4'>Postal address</h3>
        <p className='text-sm text-gray-500'>Requiered to buy art on blockchain team. For delivery purpose</p>
        {
        isEditing ?
        <input
            type="text"
            value={editablePostAddress}
            placeholder={editablePostAddress == "" ? "set your postal address" : editablePostAddress}
            onChange={(e) => setEditablePostAddress(e.target.value)}
            className="border rounded-full px-4 py-1"
        />
        :
        <p className='border rounded-full px-4 py-1 text-gray-500'>{userProvider?.user?.post_address == "" ? "no address provided" : userProvider?.user?.post_address}</p>
        }
    </div>
  )
}

export default MyProfile