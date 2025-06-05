import React from 'react'

const Button = ({label,icon,click,style}) => {
  return (
    <div>
        <button className={`${style} flex justify-center gap-3`} onClick={click}>
             <div className="">{icon}</div> <div className="w-auto">{label}</div>
        </button>
    </div>
  )
}

export default Button