import { useState } from "react";
import "./createpost.modules.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updatePost } from "../../Redux/Post/post.actions";
import { IPost } from "../../Constants/constant";
import UploadImage from "./UploadImage";

interface props {
  post: IPost;
  onClose(): void;
}

function UpdatePost({ post, onClose }: props) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [imageFile, setImageFile] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const dispatch: Dispatch<any> = useDispatch();

  const onUpdatePost = () => {
    if (title == "" || description == "") {
      return setError(true);
    } else {
      setError(false);
    }

    if (!imageFile.length) return UpadateTitleandDescription();

    const form = new FormData();
    form.append("file", imageFile[0]);
    form.append("upload_preset", "sfunzr0m");
    form.append("cloud_name", "dpzbtnmfl");

    fetch("https://api.cloudinary.com/v1_1/dpzbtnmfl/image/upload", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        const data = {
          title: title,
          description: description,
          content: res.secure_url,
        };
        dispatch(updatePost(post._id, data));
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const UpadateTitleandDescription = () => {
    console.log("without images");
    dispatch(updatePost(post._id, { title, description }));
    onClose();
  };

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update your Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            <Stack spacing={"10px"}>
              <Box m="auto">
                <Image
                  src={post.content}
                  objectFit={"contain"}
                  objectPosition="center"
                />
              </Box>
              <UploadImage
                imageFile={imageFile}
                updateImageFile={(files: FileList | null) =>
                  setImageFile(files)
                }
              />
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </Stack>
            {error && (
              <Box className="post-error" color={"red.300"} letterSpacing="1px">
                <Text>Please fill all fields</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onUpdatePost}
              colorScheme="#025bee"
              _hover={{ bg: "#307eff" }}
              bg="#025bee"
              mr={3}
            >
              Edit Post
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdatePost;
