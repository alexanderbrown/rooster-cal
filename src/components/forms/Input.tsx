import { ChangeEvent } from "react"

interface InputProps{
    type: 'text' | 'number' | 'time',
    name: string,
    value: string  | number | undefined,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    disabled?: boolean
    step?: number
}

export default function Input({type, name, value, onChange, disabled=false, step=1}: InputProps){
    if (type==='time'){
        step *= 60 //convert seconds to minutes
    }
    return <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  id={name} name={name}
                  type={type}
                  step={step}           
                  value={value} 
                  disabled={disabled}
                  onChange={onChange}/>
}