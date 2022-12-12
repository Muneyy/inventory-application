import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Text,
    Icon
} from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons';
import UploadAvatar from './UploadAvatar';
import { UserType } from '../../Types/SchemaTypes';
import { AiOutlinePicture } from 'react-icons/ai';

const UploadAvatarModal = (props: {
    userId: string,
    setLoggedinUser: React.Dispatch<React.SetStateAction<UserType>>
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button colorScheme={"pink"} mt={2} size="sm" onClick={onOpen}>
                <Icon mr={2} as={AiOutlinePicture} />
                <Text>Change Profile Picture</Text>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change Profile Picture</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <UploadAvatar userId={props.userId} setLoggedinUser={props.setLoggedinUser} onClose={onClose} />
                    </ModalBody>
                    <ModalFooter>
                        <Button size="md" colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
        </>
    )
}

export default UploadAvatarModal;