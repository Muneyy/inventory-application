import React, { useState } from 'react';
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
    Icon,
    Flex,
    Spinner,
} from '@chakra-ui/react'
import { AiOutlineDelete } from 'react-icons/ai';
import { useGetUserAndToken } from '../../../../HelperFunctions/useGetUserandToken';
import axios from 'axios';

function DeleteItemModal(props: {
   itemId: string | undefined,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loggedinUser, tokenJWT] = useGetUserAndToken();
    const [submitting, setSubmitting] = useState<boolean>(false);

    async function handleDeleteClick() {
        setSubmitting(true);
        const requesterObject = {
            requesterId: loggedinUser._id
        }
        await axios.put(`http://localhost:3000/items/${props.itemId}/delete`, requesterObject, tokenJWT)
            .then(res => {
                console.log(res.data);
                onClose();
                window.location.reload();
            })
            .catch(err => {
                console.log(err)
            })
        setSubmitting(false);
    }

    return (
        <>
            <Button borderRadius={"3xl"} size="sm" fontSize="sm" colorScheme={"red"} mt={2} onClick={onOpen}>
                <Icon mr={2} as={AiOutlineDelete} />
                <Text>Delete Item</Text>
            </Button>
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Are you sure you want to delete this item?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    </ModalBody>
                    <ModalFooter>
                        <Flex gap={2}>
                            <Button disabled={submitting} colorScheme="red" size="md" onClick={() => handleDeleteClick()}>
                                {submitting ? <Spinner></Spinner> : "Delete"}
                            </Button>
                            <Button size="md" colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
}

export default DeleteItemModal