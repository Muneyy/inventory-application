import { Center, Spinner, Text, useMediaQuery } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'

function LoadingPage() {

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return (
        <Center w={width} mt={"5rem"} display="flex" flexDir={"column"}>
            <Spinner />
            <Text>Loading...</Text>
        </Center>
    )
}

export default LoadingPage