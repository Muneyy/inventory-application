import React from 'react'
import { Box, Text } from "@chakra-ui/react";

const NotificationBadge = (props: {
    numberOfNotification : number
}) => {
    return (
        <Box
            width="1.1rem"
            height="1.1rem"
            bg="red.500"
            color="white"
            p="0.3rem"
            fontWeight="semibold"
            fontSize="sm"
            position="absolute"
            top="-10px"
            right="-5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius={"50%"}
        >
            <Text fontSize={"2xs"}>{props.numberOfNotification}</Text>
        </Box>
    );
};

export default NotificationBadge