import { User } from '@/state/api'
import Image from 'next/image'
import React from 'react'

type Props = {
    user: User
}

const UserCard = ({user}: Props) => {
  return (
    <div className='flex items-center rounded border p-4 shadow'>
        {user.profilePictureUrl && (
            <Image
            src={`p1/jpeg`}
            alt='profile picture'
            width={32}
            height={32}
            className='rounded-full '
            />
        )}
        <div>
            <h3 className='text-lg font-semibold'>{user.username}</h3>
            <p className='text-sm text-gray-500'>{user.email}</p>
            {user.cognitoId && <p className='text-xs text-gray-400'>Cognito ID: {user.cognitoId}</p>}
            {user.teamId && <p className='text-xs text-gray-400'>Team ID: {user.teamId}</p>}
        </div>
    </div>
  )
}

export default UserCard