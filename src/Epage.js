import React, { useEffect } from "react";
import axios from "axios";


const TestPage = () => {


    useEffect(() => {
        initialApi();
    }, [])


    const initialApi = () => {
        axios.get('https://jsonplaceholder.org/users')
            .then((response) => {
                console.log(response)
            })

            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>

        </div>
    )
}

export default TestPage;