import React, { useState } from "react";
import { fireEvent, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";

import axios from "axios";
import FriendAction from "./FriendAction";
import { Spinner } from "@chakra-ui/react";

jest.mock("axios");

describe("acceptFriendRequest", () => {
    it("calls the API to accept a friend request and updates notification number", async () => {
        const setNotificationNumber = jest.fn();
        const refreshUserState = jest.fn();
        // const [accept, setAccept] = useState<boolean>(false);
        const acceptFriendRequest = jest.fn(() => {
            setNotificationNumber((prevNumber: any) => prevNumber - 1);
            // setAccept(true);
            refreshUserState();
            return Promise.resolve();
        });
        const rejectFriendRequest = jest.fn(() => {
            setNotificationNumber((prevNumber: any) => prevNumber - 1);
            refreshUserState();
            return Promise.resolve();
        });
        const id = "123";
        const { getByText, queryByText, queryByTestId } = render(
            <FriendAction
                acceptFriendRequest={acceptFriendRequest}
                rejectFriendRequest={rejectFriendRequest}
                id={id}
            />
        );
        const acceptButton = getByText("Accept");
        fireEvent.click(acceptButton);
        await waitFor(() => {
            expect(acceptFriendRequest).toHaveBeenCalledWith(id);
            expect(queryByText(/Accept/i)).not.toBeInTheDocument();
            expect(queryByTestId("spinner")).toBeInTheDocument();
            expect(acceptButton).toBeDisabled;
            expect(refreshUserState).toHaveBeenCalled;
        });
    });
});
