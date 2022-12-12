export type UserType = {
    _id: string,
    username: string,
    handle: string,
    bio: string,
    friends: Record<string, unknown>[],
    avatarURL: string,
}