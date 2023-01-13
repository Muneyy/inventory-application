export type UserType = {
    _id: string | undefined,
    username: string | undefined,
    handle: string | undefined,
    bio: string | undefined,
    friends: FriendType[] | undefined,
    avatarURL: string | undefined,
}

type FriendType = {
    status: number,
    recipient: {
        _id: string,
    }
}