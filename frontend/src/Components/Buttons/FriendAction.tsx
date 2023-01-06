import React, { useState } from 'react';
import { Button, Flex, Spinner } from "@chakra-ui/react";

function FriendAction (props: { 
        acceptFriendRequest: (arg0: string) => Promise<void>;
        rejectFriendRequest: (arg0: string) => Promise<void>; 
        id: string; }) 
{
    const [clicked, setClicked] = useState<boolean>(false);
    const [accept, setAccept] = useState<boolean>(false);
    const [reject, setReject] = useState<boolean>(false);

    async function handleAcceptClick (id: string) {
        setClicked(true);
        setAccept(true);
        await props.acceptFriendRequest(id);
    }

    async function handleRejectClick (id: string) {
        setClicked(true);
        setReject(true);
        await props.rejectFriendRequest(id);
    }

    return (
        <Flex flexDir="row" justifyContent={"flex-end"}>
            <Button mr={2} onClick={() => handleAcceptClick(props.id)} size ="sm" colorScheme="teal" disabled={clicked}>  {accept ? <Spinner /> : "Accept"} </Button>
            <Button onClick={() => handleRejectClick(props.id)} size ="sm" colorScheme="red" disabled={clicked}> {reject ? <Spinner /> : "Reject"} </Button>
        </Flex>
    )
}

export default FriendAction;