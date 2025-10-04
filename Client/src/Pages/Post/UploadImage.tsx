import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Box,
  Image,
  Button,
} from "@chakra-ui/react";
import { IoCloudDone } from "react-icons/io5";
import { MdUpload, MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";

interface UploadImageProps {
  imageFile: FileList | null;
  updateImageFile: (files: FileList | null) => void;
  isUpdate?: boolean;
  existingImageUrl?: string;
}

const UploadImage = (props: UploadImageProps) => {
  const {
    imageFile: ImageFile,
    updateImageFile,
    isUpdate,
    existingImageUrl,
  } = props;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Create preview URL when image file changes or set existing image URL
  useEffect(() => {
    if (ImageFile && ImageFile.length > 0) {
      const file = ImageFile[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Cleanup function to revoke the URL to prevent memory leaks
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    } else if (existingImageUrl && !ImageFile) {
      // Show existing image when in update mode and no new file selected
      setImagePreview(existingImageUrl);
    } else {
      setImagePreview(null);
    }
  }, [ImageFile, existingImageUrl]);

  const handleRemoveImage = () => {
    updateImageFile(null);
    setImagePreview(null);
  };

  const renderImagePreview = () => {
    if (!imagePreview) return null;
    return (
      <Box mb={4} position="relative">
        <Image
          src={imagePreview}
          alt="Image preview"
          maxH="300px"
          w="100%"
          objectFit="contain"
          borderRadius="md"
          border="1px"
          borderColor="gray.200"
        />
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          colorScheme="red"
          onClick={handleRemoveImage}
          leftIcon={<MdDelete />}
        >
          Remove
        </Button>
      </Box>
    );
  };

  const renderFileInput = () => {
    return (
      <FormControl className="image-input" _hover={{ bg: "#307eff" }}>
        <FormLabel
          gap="10px"
          justifyContent={"center"}
          display={"flex"}
          className="image-input-label"
          alignItems="center"
        >
          <MdUpload />
          {isUpdate ? "Choose the Image" : "Choose the Image"}
        </FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => updateImageFile(e.target.files)}
          visibility={"hidden"}
        />
      </FormControl>
    );
  };

  return (
    <>
      {imagePreview ? (
        <Box>
          {/* Image Preview */}
          {renderImagePreview()}
          {/* Upload Success Message - only show for newly uploaded files */}
          {ImageFile && ImageFile.length > 0 && (
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
          )}
        </Box>
      ) : (
        renderFileInput()
      )}
    </>
  );
};

export default UploadImage;
