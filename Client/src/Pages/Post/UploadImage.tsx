import { Flex, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { IoCloudDone } from "react-icons/io5";
import { MdUpload } from "react-icons/md";

interface UploadImageProps {
  imageFile: FileList | null;
  updateImageFile: (files: FileList | null) => void;
  isUpdate?: boolean;
}

const UploadImage = (props: UploadImageProps) => {
  const { imageFile: ImageFile, updateImageFile, isUpdate } = props;

  return (
    <>
      {ImageFile && ImageFile.length ? (
        <Flex
          align={"center"}
          justify="space-between"
          borderRadius={"5px"}
          bg="green.200"
          color={"blackAlpha.800"}
          fontWeight="semibold"
          w="100%"
          p="2"
          px="4"
          border={"1px"}
          borderColor="gray.200"
        >
          File Uploaded
          <Text as="span">
            <IoCloudDone />
          </Text>
        </Flex>
      ) : (
        <FormControl className="image-input" _hover={{ bg: "#307eff" }}>
          <FormLabel
            gap="10px"
            justifyContent={"center"}
            display={"flex"}
            className="image-input-label"
            alignItems="center"
          >
            <MdUpload />
            {isUpdate ? "Change the Image" : "Choose the Image"}
          </FormLabel>
          <Input
            type="file"
            onChange={(e) => updateImageFile(e.target.files)}
            visibility={"hidden"}
          />
        </FormControl>
      )}
    </>
  );
};

export default UploadImage;
