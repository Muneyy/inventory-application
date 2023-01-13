import { useAppSelector } from "../app/hooks";
import { UserType } from "../Types/UserType";

interface JWTconfig {
    headers: {
        Authorization: string;
    }
}

export function useGetUserAndToken(): [UserType, JWTconfig] {
    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: UserType = {
        _id: undefined,
        username: undefined,
        handle: undefined,
        bio: undefined,
        friends: undefined,
        avatarURL: undefined,
    };
    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = ""

    // Refactor REDUX states
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }
    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }

    const JWTconfig = {
        headers: { Authorization: `Bearer ${tokenJWT}` }
    };

    return [loggedinUser, JWTconfig];
}
