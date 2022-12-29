import React, {useState, useEffect} from 'react'
import { useMediaQuery, Box } from '@chakra-ui/react'


function FeedMediaQuery() {

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return (
        <Box w={width}>
        </Box>
    )
}

export default FeedMediaQuery