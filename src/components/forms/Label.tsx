import { ReactNode } from "react";

export default function Label ({htmlFor, children, disabled=false}: {htmlFor: string, children: ReactNode, disabled?: boolean}) {
    return <label htmlFor={htmlFor} 
                  className={`block text-gray-${disabled? 400: 700} text-sm font-bold mb-1 mt-2`}>
        {children}
    </label>
}
