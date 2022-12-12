import { Text, Drawer, Image, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Container, Flex, Avatar, Button } from '@chakra-ui/react'
import React from 'react'
import { v4 as uuidv4 } from 'uuid';

function FriendsDrawer(props: {
    isOpen: boolean,
    onClose: () => void,
    btnRef: React.MutableRefObject<HTMLInputElement> & React.LegacyRef<HTMLButtonElement>,
    friendsArray?: Record<string, unknown>[],
}) {
    return (
        <Drawer
            isOpen={props.isOpen}
            placement='right'
            onClose={props.onClose}
            finalFocusRef={props.btnRef}
            size="sm"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>Friends</DrawerHeader>
                <DrawerBody>
                    <Container px={8}>
                        {props.friendsArray?.map((friend: any) => {
                            return (
                                (friend.status === 3)
                                    ? (
                                        <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                            <Flex flexDir="row" gap={5} alignItems="center">
                                                {(friend.recipient.avatarURL) 
                                                    ? (
                                                        <Image
                                                            borderRadius='full'
                                                            boxSize='50px'
                                                            src={friend.recipient.avatarURL}
                                                            objectFit="cover"
                                                            alt='Avatar'/>
                                                    ) 
                                                    : (
                                                        <Avatar size={"md"}></Avatar>
                                                    )}
                                                <Flex flex="1" overflow="hidden" flexDir={"column"}>
                                                    <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                    <Text fontSize="sm" color="gray">@{friend.recipient.handle}</Text>
                                                    <Button maxWidth={"80px"} size ="sm" colorScheme="pink" disabled> Friend </Button>
                                                </Flex>
                                            </Flex>
                                        </Container>
                                    ) : (
                                        <Text key={uuidv4()}></Text>
                                    )
                            )
                        })}
                    </Container>
                </DrawerBody>

                {/* <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
Cancel
              </Button>
              <Button colorScheme='teal'>Save</Button>
          </DrawerFooter> */}
            </DrawerContent>
        </Drawer>
    )
}

export default FriendsDrawer