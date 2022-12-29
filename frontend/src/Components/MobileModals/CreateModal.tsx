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
import { FiFeather } from 'react-icons/fi';

function CreateModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
        <Button h="100%" flex="1" display="flex" justifyContent="center" alignItems="center" onClick={onOpen}>
            <Icon boxSize={"22px"} as={FiFeather} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Links</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDir="column">
                        <RouteLink onClick={onClose} to='/createUser' style={{ textDecoration: 'none' }}>
                            <Button onClick={onClose} size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                            Sign up
                            </Button>
                        </RouteLink>
                        <RouteLink onClick={onClose} to='/login' style={{ textDecoration: 'none' }}>
                            <Button mb={10} size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                            Log in
                            </Button>
                        </RouteLink>
                        <RouteLink onClick={onClose} to="/createCollection">
                            <Button borderRadius="3xl" size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                            Collection
                            </Button>
                        </RouteLink>
                        <RouteLink onClick={onClose} to='/createItem' style={{ textDecoration: 'none' }}>
                            <Button borderRadius="3xl" size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                            Item
                            </Button>
                        </RouteLink>
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