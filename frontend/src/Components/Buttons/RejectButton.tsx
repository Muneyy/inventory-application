import React, { useEffect, useState } from 'react';
import { Button } from "@chakra-ui/react";
import { isDisabled } from '@testing-library/user-event/dist/utils';


function RejectButton (props: { rejectFriendRequest: (arg0: string, arg1: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<void>; id: string; }) {
    const [clicked, setClicked] = useState<boolean>(false);

    async function handleClick (id: string, e: React.MouseEvent<HTMLElement>) {
        await props.rejectFriendRequest(id, e);
        setClicked(true);
    }

    return (
        <Button onClick={(e) => handleClick(props.id, e)} size ="sm" colorScheme="red" disabled={clicked}> {clicked ? "Rejected" : "Reject"} </Button>
    )
}

export default RejectButton;