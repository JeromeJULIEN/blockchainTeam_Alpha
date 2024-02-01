'use client'
// libraries
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../providers/userProvider'
import { doc, setDoc } from 'firebase/firestore'
import {toast} from 'react-toastify'
import { getAuth, signOut } from 'firebase/auth';
import { useDisconnect, useLogout } from "@thirdweb-dev/react";
// providers
import { useFirebase } from '../providers/firebaseProvider'
// components
import { concatAddress } from '../utils/utilsFunctions'
import { useUpdateUserInFirebase } from '../lib/firebaseManager'
import MainButtonLabel from '@/components/Button/MainButtonLabel'
import CancelButtonLabel from '@/components/Button/CancelButtonLabel'




type Props = {}

const MyProfile = (props: Props) => {
    //! :::: GLOBAL STATE ::::
    const userProvider = useUser()
    const {auth,db} = useFirebase()
    const { logout, isLoading } = useLogout();
    const router = useRouter()
    const disconnect = useDisconnect()
    const saveChange = useUpdateUserInFirebase()

    //! :::: LOCAL STATE ::::
    const [isEditing, setIsEditing] = useState<Boolean>(false)
    const [editableEmail, setEditableEmail] = useState<string>(userProvider?.user?.email || "");
    const [editablePostAddress, setEditablePostAddress] = useState<string>(userProvider?.user?.post_address || "");
    const [editablePhone, setEditablePhone] = useState<string>(userProvider?.user?.phone || "");

    const handleSavingChange = async()=>{        
        await saveChange(editableEmail, editablePostAddress, editablePhone)
        setIsEditing(false)
    }   

  return (  
    <div className='p-4 flex flex-col items-center w-1/2'>
        {
        isEditing ?
        <div className='flex gap-1 w-full'>
            <button className="w-1/2"  onClick={handleSavingChange}><MainButtonLabel text="Save changes ✅"/></button>
            <button className="w-1/2" onClick={()=>setIsEditing(false)}><CancelButtonLabel text="cancel"/></button>
        </div>
        :
        <button className="w-1/2" onClick={()=>{setIsEditing(!isEditing)}}><MainButtonLabel text="edit ✍️"/></button>
        }
        {/* crypto wallet */}
        <h3 className='font-semibold pt-4'>My blockchain team wallet (unchangeable)</h3>
        <p className='text-sm text-gray-500'>This the the wallet address on which you will receive your digitals assets</p>
        <p className='border rounded-full px-4 py-1 text-gray-500 w-full text-center'>{concatAddress(userProvider?.user?.wallet) }</p>
        {/* email */}
        <h3 className='font-semibold pt-4'>My contact email (unchangeable)</h3>
        <p className='text-sm text-gray-500'>Has to be the same you use to connect to blockchain team app</p>
        <p className='text-sm text-gray-500'>Requiered to buy art on blockchain team. For billing purpose</p>
        <p className='border rounded-full px-4 py-1 text-gray-500 w-full text-center'>{userProvider?.user?.email == "" ? "no email provided" : userProvider?.user?.email}</p>
        {/* postal address */}
        <h3 className='font-semibold pt-4'>Postal address</h3>
        <p className='text-sm text-gray-500'>Requiered to buy art on blockchain team. For delivery purpose</p>
        {
        isEditing ?
        <input
            type="text"
            value={editablePostAddress}
            placeholder={editablePostAddress == "" ? "set your postal address" : editablePostAddress}
            onChange={(e) => setEditablePostAddress(e.target.value)}
            className="border rounded-full px-4 py-1 w-full text-center"
        />
        :
        <p className='border rounded-full px-4 py-1 text-gray-500 w-full text-center'>{userProvider?.user?.post_address == "" ? "no address provided" : userProvider?.user?.post_address}</p>
        }
        {/* phone */}
        <h3 className='font-semibold pt-4'>Phone number</h3>
        <p className='text-sm text-gray-500'>Optional</p>
        {
        isEditing ?
        <input
            type="text"
            value={editablePhone}
            placeholder={editablePhone == "" ? "set your phone number" : editablePhone}
            onChange={(e) => setEditablePhone(e.target.value)}
            className="border rounded-full px-4 py-1 w-full text-center"
        />
        :
        <p className='border rounded-full px-4 py-1 text-gray-500 w-full text-center'>{userProvider?.user?.phone == "" ? "no phone number provided" : userProvider?.user?.phone}</p>
        }
    </div>
  )
}

export default MyProfile