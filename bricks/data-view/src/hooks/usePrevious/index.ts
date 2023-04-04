import {useRef, useEffect} from 'react';
export  function usePrevious<T>(data?: T):T|undefined{
    const ref = useRef<T>();
    useEffect(()=>{
        ref.current = data
    })
    return ref.current;
}
