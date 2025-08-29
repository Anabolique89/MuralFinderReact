import React from 'react'

const Button = ({ styles }) => {
  return (
   <button type="button" className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full ${styles}`}>Add Wall</button>
  )
}

export default Button