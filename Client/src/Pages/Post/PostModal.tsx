import {
  Box,
  Button,
  Flex,
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
import { createPost, updatePost } from "../../Redux/Post/post.actions";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { RootState } from "../../Redux/store";
import { IoCloudDone } from "react-icons/io5";
import { MdUpload } from "react-icons/md";
import { Input } from "@chakra-ui/input";
import { Dispatch } from "redux";
import "./createpost.modules.css";
import UploadImage from "./UploadImage";
import { IPost } from "../../Constants/constant";

interface PostModalProps {
  onClose(): void;
  mode: "create" | "update";
  post?: IPost; // Only required when mode is "update"
}

function PostModal({ onClose, mode, post }: PostModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const dispatch: Dispatch<any> = useDispatch();
  const { userCredential } = useSelector((store: RootState) => store.auth);

  // Initialize form values for update mode
  useEffect(() => {
    if (mode === "update" && post) {
      setTitle(post.title);
      setDescription(post.description);
    }
  }, [mode, post]);

  const isCreateMode = mode === "create";
  const isUpdateMode = mode === "update";

  const validateForm = () => {
    if (isCreateMode) {
      // For create mode, all fields are required including image
      return (
        titleRef.current?.value && descRef.current?.value && imageFile?.length
      );
    } else {
      // For update mode, only title and description are required
      return title.trim() !== "" && description.trim() !== "";
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return setError(true);
    } else {
      setError(false);
    }

    // If updating and no new image selected, update only title and description
    if (isUpdateMode && (!imageFile || !imageFile.length)) {
      const data = { title, description };
      dispatch(updatePost(post!._id, data));
      onClose();
      return;
    }

    // Upload image to Cloudinary and then create/update post
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
        if (isCreateMode) {
          const data = {
            title: titleRef.current!.value,
            description: descRef.current!.value,
            content: res.secure_url,
            author: userCredential._id,
            authorID: userCredential._id,
          };
          dispatch(createPost(data));
        } else {
          const data = {
            title,
            description,
            content: res.secure_url,
          };
          dispatch(updatePost(post!._id, data));
        }
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderPostInputSection = () => {
    if (isCreateMode) {
      return (
        <>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input placeholder="Title" ref={titleRef} />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea placeholder="Description" ref={descRef} />
          </FormControl>
        </>
      );
    } else {
      return (
        <>
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
        </>
      );
    }
  };

  const getModalTitle = () => {
    return isCreateMode ? "Create your Post" : "Update your Post";
  };

  const getButtonText = () => {
    return isCreateMode ? "Create Post" : "Edit Post";
  };

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{getModalTitle()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            <Stack spacing={"10px"}>
              <UploadImage
                imageFile={imageFile}
                updateImageFile={(files: FileList | null) =>
                  setImageFile(files)
                }
                isUpdate={isUpdateMode}
                existingImageUrl={
                  isUpdateMode && post ? post.content : undefined
                }
              />
              {renderPostInputSection()}
            </Stack>
            {error && (
              <Box className="post-error" color={"red.300"} letterSpacing="1px">
                <Text>Please fill all fields</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleSubmit}
              colorScheme="#025bee"
              _hover={{ bg: "#307eff" }}
              bg="#025bee"
              mr={3}
            >
              {getButtonText()}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PostModal;
