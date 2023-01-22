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
import { AiOutlineDelete } from 'react-icons/ai';
import { useGetUserAndToken } from '../../../../../HelperFunctions/useGetUserandToken';
import axios from 'axios';

function DeleteCollectionModal(props: {
    collectionId: string | undefined,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loggedinUser, tokenJWT] = useGetUserAndToken();

    async function handleDeleteClick() {
        const requesterObject = {
            requesterId: loggedinUser._id
        }
        await axios.post(`http://localhost:3000/collections/${props.collectionId}/delete`, requesterObject, tokenJWT)
            .then(res => {
                console.log(res.data);
                onClose();
                window.location.reload();
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            <Button colorScheme={"pink"} mt={2} size="xs" onClick={onOpen}>
                <Icon mr={2} as={AiOutlineDelete} />
                <Text>Delete Collection Contents</Text>
            </Button>
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Are you sure you want to delete this collection?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Button colorScheme="red" size="lg" onClick={() => handleDeleteClick()}>
                            Delete
                        </Button>
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

export default DeleteCollectionModal