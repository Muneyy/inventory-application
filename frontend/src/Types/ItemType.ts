type ItemType = {
    name: string,
    description: string,
    tags: string[],
    price: number,
    category: string,
    images_urls: string[],
    group: {
        name: string,
        summary: string,
        _id: string,
    },
    user: {
        avatarURL: string,
        username: string,
        handle: string,
        _id: string,
    },
    _id: string,
    likeCounter: number,
    likeUsers: LikedUserType[],
    commentCounter: number,
    commentUsers: CommentUserType[],
};

type LikedUserType = {
    user: {
        _id: string,
    }
}

type CommentUserType = {
    user: {
        _id: string,
        username: string,
        handle: string,
        avatarURL: string,
    },
    text: string,
}

export default ItemType;