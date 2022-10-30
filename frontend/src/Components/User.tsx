import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner } from '@chakra-ui/react'

function User() {
    const [loading, setLoading] = useState(0);
    const [reqData, setReqData] = useState<any>({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users');
                setLoading(1);
                setReqData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, []);

    return (
        (loading)
            ? (
                <div>
                    <h1>
                        Users:
                    </h1>
                    {reqData.map((user: any) => (
                        <h2 key={uuidv4()}>{user.username}</h2>
                    ))}
                </div>
            )
            : (
                <div>
                    <h1>
                        <Spinner />
                    </h1>
                </div>
            )
    );
}

export default User;
