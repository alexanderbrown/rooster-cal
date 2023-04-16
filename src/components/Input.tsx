import { ChangeEvent } from "react"

interface InputProps{
    type: 'text' | 'number' | 'time',
    name: string,
    value: string  | number | undefined,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    background?: string
    disabled?: boolean
    step?: number
    tooltip_content?: string
}

export default function Input({type, name, value, onChange, disabled=false, step=1, tooltip_content, background}: InputProps){
    if (type==='time'){
        step *= 60 //convert seconds to minutes
    }
    const className = `shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight 
                       focus:outline-none focus:shadow-outline
                       ${background? background: 'bg-white'}`
    return <input className={className} 
                  id={name} name={name}
                  type={type}
                  step={step}           
                  value={value} 
                  disabled={disabled}
                  onChange={onChange}
                  data-tooltip-id="my-tooltip" 
                  data-tooltip-html={tooltip_content} 
                  data-tooltip-place="top"/>
}