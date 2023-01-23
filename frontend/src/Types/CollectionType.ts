type CollectionType = {
    name: string,
    summary: string,
    tags: string[],
    image_url: string,
    user: {
        _id: string,
        username: string,
        avatarURL: string,
    },
    _id: string,
    isDeleted: boolean,
}

export default CollectionType