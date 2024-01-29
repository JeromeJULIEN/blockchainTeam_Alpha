'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { AiOutlineMail } from "react-icons/ai";
import { IoMdCloseCircleOutline } from "react-icons/io";



type Props = {
    onClose : () => void,
}

const ConnexionModal = (props : Props) => {
    // Connexion mode display management
    const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signUp');
    const toggleAuthMode = () => {
        setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn');
    };

    // email form value management
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-5 rounded-xl flex flex-col items-center gap-4 w-3/4">
                <div className='flex justify-center items-center w-full'>
                    <div className='flex-grow'></div>
                    <h3 className='font-semibold text-xl pb-4'>Connect to the blockchain Team</h3> 
                    <div className='flex-grow'></div>
                    <div className='text-2xl' onClick={props.onClose}><IoMdCloseCircleOutline/></div>
                </div>
                {/* :::: SIGNUP :::: */}
                { authMode == 'signUp' &&
                <>
                {/* connect with google */}
                <button className='bg-black text-white flex justify-center items-center gap-4 rounded-full px-4 py-2 w-1/2'>
                    <Image src='/logo_google.png' alt='google logo' width={25} height={25}/> 
                    Sign up with Google
                </button>
                {/* separator */}
                <div className="flex items-center justify-center w-full">
                    <div className="flex-grow  border-t border-gray-400"></div>
                    <span className="px-4 bg-white text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>
                {/* connect with email */}
                <form className='flex flex-col justify-center items-center gap-4 w-1/2'>
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='email'
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='password'
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='Confirm password'
                        type="password" 
                        id="confirmPassword" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    <button className="bg-black rounded-full text-white px-4 py-2 w-full" type="submit">
                        <div className='flex justify-center items-center gap-4'>
                            <p className='text-2xl'><AiOutlineMail/></p>
                            <p>Create an account</p>
                        </div>
                    </button>
                </form>
                <div className='text-gray-400 text-sm pt-4 w-1/2 text-center'>By signing up, your accepting the general terme and condition of the blockchain team</div>
                <div className='flex justify-center gap-2 text-gray-400 text-sm pt-4 w-1/2 text-center'>
                    <p>You already have an account ?</p>
                    <button onClick={toggleAuthMode} className='font-bold underline text-black'>Sign in</button>
                </div>
                </>
                }
                {/* :::: SIGNIN :::: */}
                {authMode == "signIn" && 
                <>
                {/* connect with google */}
                <button className='bg-black text-white flex justify-center items-center gap-4 rounded-full px-4 py-2 w-1/2'>
                    <Image src='/logo_google.png' alt='google logo' width={25} height={25}/> 
                    Sign in with Google
                </button>
                {/* separator */}
                <div className="flex items-center justify-center w-full">
                    <div className="flex-grow  border-t border-gray-400"></div>
                    <span className="px-4 bg-white text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>
                {/* connect with email */}
                <form className='flex flex-col justify-center items-center gap-4 w-1/2'>
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='email'
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='password'
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button className="bg-black rounded-full text-white px-4 py-2 w-full" type="submit">
                        <div className='flex justify-center items-center gap-4'>
                            <p className='text-2xl'><AiOutlineMail/></p>
                            <p>Sign in</p>
                        </div>
                    </button>
                </form>
                <div className='flex justify-center gap-2 text-gray-400 text-sm pt-4 w-1/2 text-center'>
                    <p>You don&apos;t have an account ?</p>
                    <button onClick={toggleAuthMode} className='font-bold underline text-black'>Sign up</button>
                </div>
                </>
                }
            </div>
        </div>
  )
}

const signupView = () =>{
    
}

export default ConnexionModal