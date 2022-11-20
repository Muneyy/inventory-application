import React from "react"
import { v4 as uuidv4 } from 'uuid';
import { useDisclosure, Button, Collapse, Container, Text } from "@chakra-ui/react"

function incomingFriendRequests (
    loggedinUser : {
        friends: [
            friend: {
                recipient: {
                    username: string
                }
            }
        ]
    },
) {
    const { isOpen, onToggle } = useDisclosure()
    return (
        <>
            <Button onClick={onToggle} size="md">Incoming Friend Requests:</Button>
            <Collapse in={isOpen} animateOpacity>
                {loggedinUser.friends.map((friend: any) => {
                    return (
                        (friend.status === 2)
                            ? (
                                <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                    <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                    <Button size ="sm" colorScheme="teal"> Accept </Button>
                                    <Button size ="sm" colorScheme="red"> Reject </Button>
                                </Container>
                            ) : (
                                <Text key={uuidv4()}></Text>
                            )
                    )
                })}
            </Collapse>
        </>
    )
}

export default incomingFriendRequests