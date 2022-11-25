import React, { useEffect, useState } from 'react';
import { Button } from "@chakra-ui/react";
import { isDisabled } from '@testing-library/user-event/dist/utils';


function FriendAction (props: { 
        acceptFriendRequest: (arg0: string, arg1: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<void>;
        rejectFriendRequest: (arg0: string, arg1: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<void>; 
        id: string; }) 
{
    const [clicked, setClicked] = useState<boolean>(false);
    const [accept, setAccept] = useState<boolean>(false);
    const [reject, setReject] = useState<boolean>(false);

    async function handleAcceptClick (id: string, e: React.MouseEvent<HTMLElement>) {
        await props.acceptFriendRequest(id, e);
        setClicked(true);
        setAccept(true);
    }

    async function handleRejectClick (id: string, e: React.MouseEvent<HTMLElement>) {
        await props.acceptFriendRequest(id, e);
        setClicked(true);
        setReject(true);
    }

    return (
        <>
            <Button onClick={(e) => handleAcceptClick(props.id, e)} size ="sm" colorScheme="teal" disabled={clicked}>  {accept ? "Friends" : "Accept"} </Button>
            <Button onClick={(e) => handleRejectClick(props.id, e)} size ="sm" colorScheme="red" disabled={clicked}> {reject ? "Rejected" : "Reject"} </Button>
        </>
    )
}

export default FriendAction;