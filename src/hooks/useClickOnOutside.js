
import React, { useEffect } from 'react'

export const useClickOnOutside = (ref,handler) => {

    useEffect(()=>{
        function listener(event){
            console.log("Inside listener");
            
            if(!ref.current || ref.current.contains(event.target)){
                return;
            }
            console.log("REF.CURRENT",ref.current)
            handler(event);
        }
        
        console.log("Mounting");
        document.addEventListener("mousedown",listener);
        document.addEventListener("touchstart",listener)

        return () => {
            console.log("Unmounting")
            document.removeEventListener("mousedown",listener)
            document.removeEventListener("touchstart",listener)
        }
    },[ref,handler])
}
