type ItemType = {
    name: string,
    description: string,
    tags: string[],
    price: number,
    images_urls: string[],
    group: string,
    user: {
        avatarURL: string,
        username: string,
        handle: string,
        _id: string,
    },
    _id: string,
    likeCounter: number,
    likeUsers: LikedUserType[],
}

type LikedUserType = {
    user: {
        _id: string,
    }
}

export default ItemType;