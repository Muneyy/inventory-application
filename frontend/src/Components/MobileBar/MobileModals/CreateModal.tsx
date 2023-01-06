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
    Icon,
    Box,
} from '@chakra-ui/react';
import {Link as RouteLink} from "react-router-dom";
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FiFeather } from 'react-icons/fi';

function CreateModal() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    function navigateTo (route:string) {
        onClose();
        navigate(route)
    }
    
    return (
        <Button h="100%" flex="1" display="flex" justifyContent="center" alignItems="center" onClick={onOpen}>
            <Icon boxSize={"22px"} as={FiFeather} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Links</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} gap={3} flexDir="column">
                        <Button width="150px" onClick={() => navigateTo("/createUser")} size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                            Sign up
                        </Button>
                        <Button width="150px" onClick={() => navigateTo("/login")} mb={10} size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                            Log in
                        </Button>
                        <Button width="150px" onClick={() => navigateTo('/createCollection')} borderRadius="3xl" size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                            Collection
                        </Button>
                        <Button width="150px" onClick={() => navigateTo('/')} borderRadius="3xl" size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                            Item
                        </Button>
                        
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Button>
    )
}

export default CreateModal