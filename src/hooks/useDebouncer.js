import { useEffect, useState } from "react"


const useDebouncer = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedValue(value)
        },delay)

        return () => {
            clearTimeout(handle)
        }
    },[value,delay])

    return debouncedValue;
}


export default useDebouncer;