import {
    Spinner,
    Box,
    Flex,
    Checkbox,
    Divider,
    Container,
    Heading,
    Center,
    Text,
    Button,
    Stack,
    Link,
    Select,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    CheckboxGroup,
    Tag,
    Textarea,
    useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dropzone from "react-dropzone";
import { useAppSelector } from "../../../app/hooks";
import LoadingPage from "../Loading/LoadingPage";
import { useGetUserAndToken } from "../../../HelperFunctions/useGetUserandToken";

function CreateCollection() {
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    const [reqData, setReqData] = useState([]);
    // filename for react dropzone
    const [fileName, setFileName] = useState<string>("");
    // check if picture has been uploaded
    const [uploadedPicture, setUploadedPicture] = useState<boolean>(false);

    const [loggedinUser, tokenJWT] = useGetUserAndToken();

    const availableTags = [
        "anime",
        "comics",
        "cartoon",
        "series",
        "movie",
        "k-pop",
        "j-pop",
        "p-pop",
        "soloist",
        "boy-group",
        "girl-group",
    ];

    const CollectionSchema = Yup.object().shape({
        name: Yup.string()
            .min(1, "Name must be between 1-20 characters")
            .max(20, "Name must be between 1-20 characters")
            .required("Required"),
        summary: Yup.string()
            .min(1, "Summary must be between 1-40 characters")
            .max(200, "Summary must be between 1-40 characters")
            .required("Required"),
        tags: Yup.array()
            .of(Yup.string().oneOf(availableTags, "Invalid tag"))
            .min(1, "Please select at least one tag")
            .required("Please select at least one tag"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            summary: "",
            tags: [],
            image: "",
            user: "",
        },
        validationSchema: CollectionSchema,
        onSubmit: async (values) => {
            setSubmitting(true);
            const submitCollection = {
                name: values.name,
                summary: values.summary,
                tags: values.tags,
                user: loggedinUser._id,
            };

            await axios
                .post(
                    "http://localhost:3000/collections/post",
                    submitCollection,
                    tokenJWT
                )
                .then(async (res) => {
                    if (uploadedPicture) {
                        const imageUploadForm = new FormData();
                        imageUploadForm.append("image", values.image);
                        if (loggedinUser._id !== undefined) {
                            imageUploadForm.append(
                                "requesterId",
                                loggedinUser._id
                            );
                        }
                        imageUploadForm.append("collectionId", res.data._id);

                        await axios
                            .post(
                                "http://localhost:3000/uploadAvatar",
                                imageUploadForm,
                                tokenJWT
                            )
                            .then((res) => {
                                console.log(res.data.msg);
                                navigate("/");
                            });
                    } else {
                        navigate("/");
                    }
                });
        },
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/users");
                setReqData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");

    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return (
        // TODO: FIX: loading is not working as intended
        loading ? (
            loggedinUser._id ? (
                <Flex w={width} px={10}>
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl isRequired>
                            <FormLabel>Name:</FormLabel>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            />
                            {formik.errors.name && formik.touched.name ? (
                                <Alert
                                    mt={1}
                                    p={2}
                                    size="sm"
                                    borderRadius="3xl"
                                    status="warning"
                                >
                                    <AlertIcon />
                                    {formik.errors.name}
                                </Alert>
                            ) : (
                                <FormHelperText>
                                    Name cannot be empty.
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Divider my="1rem" />
                        <FormControl isRequired>
                            <FormLabel>Summary:</FormLabel>
                            <Textarea
                                name="summary"
                                id="summary"
                                onChange={formik.handleChange}
                                value={formik.values.summary}
                            />
                            {formik.errors.summary && formik.touched.summary ? (
                                <Alert
                                    mt={1}
                                    p={2}
                                    size="sm"
                                    borderRadius="3xl"
                                    status="warning"
                                >
                                    <AlertIcon />
                                    {formik.errors.summary}
                                </Alert>
                            ) : (
                                <FormHelperText>
                                    Describe your collection.
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Divider my="1rem" />
                        <FormControl>
                            <FormLabel>Tags:</FormLabel>
                            <CheckboxGroup colorScheme={"teal"}>
                                <Flex wrap={"wrap"} gap={3}>
                                    {availableTags.map((tag: string) => {
                                        return (
                                            <Checkbox
                                                key={uuidv4()}
                                                name={tag}
                                                id={tag}
                                                onChange={(e) => {
                                                    const { checked, name } =
                                                        e.target;
                                                    if (checked) {
                                                        formik.setFieldValue(
                                                            "tags",
                                                            [
                                                                ...formik.values
                                                                    .tags,
                                                                name,
                                                            ]
                                                        );
                                                    } else {
                                                        formik.setFieldValue(
                                                            "tags",
                                                            formik.values.tags.filter(
                                                                (v) =>
                                                                    v !== name
                                                            )
                                                        );
                                                    }
                                                }}
                                                value={tag}
                                            >
                                                {tag}
                                            </Checkbox>
                                        );
                                    })}
                                </Flex>
                            </CheckboxGroup>
                            {formik.errors.tags && formik.touched.tags ? (
                                <Alert
                                    mt={1}
                                    p={2}
                                    size="sm"
                                    borderRadius="3xl"
                                    status="warning"
                                >
                                    <AlertIcon />
                                    {formik.errors.tags}
                                </Alert>
                            ) : (
                                <FormHelperText>
                                    Choose appropriate tags for your collection.
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Divider my="1rem" />
                        <FormControl>
                            {/* This handles image upload or dropzone */}
                            <FormLabel>
                                Upload image for your collection here
                            </FormLabel>
                            <Dropzone
                                onDrop={(acceptedFiles) => {
                                    formik.setFieldValue(
                                        "image",
                                        acceptedFiles[0]
                                    );
                                    console.log(acceptedFiles[0]);
                                    setUploadedPicture(true);
                                    setFileName(acceptedFiles[0].name);
                                }}
                                // Accept only images of these filetypes
                                accept={{
                                    "image/png": [".png"],
                                    "image/jpeg": [".jpg", ".jpeg"],
                                    "image/gif": [".gif"],
                                    "image/webp": [".webp"],
                                }}
                            >
                                {({
                                    getRootProps,
                                    getInputProps,
                                    isDragActive,
                                }) => (
                                    <Box
                                        p={3}
                                        borderStyle={"dashed"}
                                        borderWidth="1px"
                                        {...getRootProps()}
                                    >
                                        <input {...getInputProps()} />
                                        {isDragActive ? (
                                            <p>Drop the files here ...</p>
                                        ) : uploadedPicture ? (
                                            <Text opacity={"80%"}>
                                                {fileName}
                                            </Text>
                                        ) : (
                                            <Text opacity={"80%"}>
                                                Drag and drop your image here,
                                                or click to select an image.
                                            </Text>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                        </FormControl>
                        <Divider my="1rem" />
                        <Select
                            id="user"
                            name="user"
                            placeholder={loggedinUser.username}
                            onChange={formik.handleChange}
                            // defaultValue={formik.values.user}
                            value={formik.values.user}
                            isRequired
                            disabled
                        >
                            <option key={uuidv4()} value={loggedinUser._id}>
                                {loggedinUser.username}
                            </option>
                        </Select>
                        <Divider my="1rem" />
                        <Button
                            disabled={submitting}
                            type="submit"
                            colorScheme="teal"
                        >
                            {submitting ? (
                                <Spinner></Spinner>
                            ) : (
                                <Text>Create</Text>
                            )}
                        </Button>
                    </form>
                </Flex>
            ) : (
                <Center w={width}>
                    <Alert status="error" borderRadius={"3xl"}>
                        <AlertIcon />
                        <AlertTitle>Please log in first.</AlertTitle>
                        <AlertDescription>
                            Create collections here after logging in.
                        </AlertDescription>
                    </Alert>
                </Center>
            )
        ) : (
            <LoadingPage />
        )
    );
}

export default CreateCollection;
