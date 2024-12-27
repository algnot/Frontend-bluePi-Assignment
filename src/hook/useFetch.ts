"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export function useFetch <T> (fetchFunction: () => Promise<T | undefined>) : [
    T | undefined,
    () => void
] {
    const [data, setData] = useState<T | undefined>(undefined);
    const router = useRouter();
    
    const fetchData = async () => {
        const response = await fetchFunction();
        if(!response) {
            router.push("/");
        }
        setData(response)
    }

    useEffect(() => {   
        if(!data) {
            fetchData();
        }
    }, [fetchFunction])

    return [data, fetchData];
}