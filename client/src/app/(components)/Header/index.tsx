import React from 'react'

type Props = {
    name: string,
    buttonComponent?: any,
    isSmallText?: boolean,
    deleteButton?: any
    
}

const Header = ({name, buttonComponent, isSmallText = false, deleteButton}: Props) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between">
        <h1 className={`${isSmallText ? 'text-2xl' : 'text-3xl'} font-bold text-gray-800 dark:text-white`}>
            {name}
        </h1>
        <div className='flex flex-col gap-2'>
        {buttonComponent}
        {deleteButton}
        </div>
    </div>
  )
}

export default Header