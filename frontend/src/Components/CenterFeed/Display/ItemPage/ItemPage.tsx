import { useMediaQuery, Flex } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ItemType from '../../../../Types/ItemType';
import ItemCard from '../../CardComponents/ItemCard'
import LoadingPage from '../../Loading/LoadingPage';

function ItemPage() {
    const {itemId} = useParams();
    const [fetchedItem, setFetchedItem] = useState<ItemType>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`http://localhost:3000/items/${itemId}`)
            .then(res => {
                setFetchedItem(res.data.item);
                setIsLoading(false);
            }).catch(err => {
                console.error(err);
            })
    }, [])

    // For picture width
    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
    const [pictureWidth, setPictureWidth] = useState(isSmallScreen ? "300px" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
        setPictureWidth(isSmallScreen ? "100vw" : "570px")
    }, [isSmallScreen]);

    return (
        (isLoading) ? (
            <LoadingPage />
        ) : (
            (fetchedItem) ? (
                <Flex top={-10} position={"relative"} w={width} flexDirection={"column"}>
                    <ItemCard item={fetchedItem} pictureWidth={pictureWidth} />
                </Flex>
            ) : (
                null
            )
        )
    )
}

export default ItemPage