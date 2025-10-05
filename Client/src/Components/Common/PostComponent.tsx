import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Text,
  BoxProps,
  HStack,
  VStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { CalcTime } from "../../helper/helper";
import CommentForm from "../Cards/Comments/CommentForm";
import CommentsList from "../Cards/Comments/CommentsList";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { AiFillLike, AiOutlineLike, AiOutlineClose } from "react-icons/ai";
import { FaShare, FaRegBookmark, FaEllipsisH } from "react-icons/fa";
import { BiCommentDots, BiCollapse, BiExpand } from "react-icons/bi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import useToggle from "../../Custom-Hooks/useToggle";
import PostModal from "../../Pages/Post/PostModal";
import { useState, useMemo, useEffect, useRef } from "react";
import useCopyToClipboard from "../../Custom-Hooks/useCopyToClipboard";
import "../Cards/PostCards/PostCard.css";
import "./PostComponent.css";
import { IPost } from "../../Constants/constant";

interface PostComponentProps {
  post: IPost;
  IsLikedPost?: boolean;
  IsFollowing?: boolean;
  showComments?: boolean;
  onToggleComments?: () => void;
  onLikePost?: () => void;
  onUnlikePost?: () => void;
  onDeletePost?: () => void;
  onFollowUser?: () => void;
  onCreateComment?: (message: string) => void;
  comments?: any;
  replies?: any;
  isFullView?: boolean;
  containerProps?: BoxProps;
}

function PostComponent({
  post,
  IsLikedPost = false,
  IsFollowing = false,
  showComments = false,
  onToggleComments,
  onLikePost,
  onUnlikePost,
  onDeletePost,
  onFollowUser,
  onCreateComment,
  comments,
  replies,
  isFullView = false,
  containerProps = {},
}: PostComponentProps) {
  const [copyToClipboard, { value, success }]: any = useCopyToClipboard();
  const { userCredential } = useSelector((store: RootState) => store.auth);
  const [isOpen, onOpen, onClose]: any = useToggle(false);

  // State for text expansion and image full screen
  const [expanded, setExpanded] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Close full screen modal with Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showFullScreen) {
        setShowFullScreen(false);
      }
    };

    if (showFullScreen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showFullScreen]);

  const handleLikeToggle = () => {
    if (IsLikedPost) {
      onUnlikePost?.();
    } else {
      onLikePost?.();
    }
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleSavePost = () => {
    // TODO: Implement save post functionality
    console.log("Save post clicked");
    setShowMenu(false);
  };

  const handleReportPost = () => {
    // TODO: Implement report post functionality
    console.log("Report post clicked");
    setShowMenu(false);
  };

  // Truncate description for "read more" functionality
  const truncatedDescription = useMemo(() => {
    if (!post.description) return "";
    return post.description.length > 200
      ? post.description.substring(0, 200) + "..."
      : post.description;
  }, [post.description]);

  const renderPostMenu = () => {
    return (
      <Box position="relative" flexShrink={0} ref={menuRef}>
        <IconButton
          aria-label="More options"
          icon={<BsThreeDots />}
          variant="ghost"
          size="sm"
          borderRadius="full"
          color="gray.500"
          _hover={{
            bg: "gray.100",
            color: "gray.700",
          }}
          onClick={handleMenuToggle}
        />

        {/* Dropdown Menu */}
        {showMenu && (
          <Box
            position="absolute"
            top="100%"
            right={0}
            bg="white"
            boxShadow="xl"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            minW="180px"
            py={2}
            zIndex={10}
            transform="translateY(4px)"
          >
            <VStack spacing={0} align="stretch">
              <Button
                variant="ghost"
                size="sm"
                justifyContent="flex-start"
                fontWeight="500"
                px={4}
                py={3}
                borderRadius={0}
                _hover={{ bg: "gray.50" }}
                onClick={handleSavePost}
              >
                Save post
              </Button>
              <Button
                variant="ghost"
                size="sm"
                justifyContent="flex-start"
                fontWeight="500"
                px={4}
                py={3}
                borderRadius={0}
                _hover={{ bg: "gray.50" }}
                onClick={handleReportPost}
              >
                Report post
              </Button>
              {post?.authorID === userCredential._id && (
                <>
                  <Box as="hr" borderColor="gray.200" />
                  <Button
                    variant="ghost"
                    size="sm"
                    justifyContent="flex-start"
                    fontWeight="500"
                    px={4}
                    py={3}
                    borderRadius={0}
                    _hover={{ bg: "gray.50" }}
                    onClick={() => {
                      onOpen();
                      setShowMenu(false);
                    }}
                  >
                    Edit post
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    justifyContent="flex-start"
                    fontWeight="500"
                    px={4}
                    py={3}
                    borderRadius={0}
                    color="red.500"
                    _hover={{ bg: "red.50" }}
                    onClick={() => {
                      onDeletePost?.();
                      setShowMenu(false);
                    }}
                  >
                    Delete post
                  </Button>
                </>
              )}
            </VStack>
          </Box>
        )}
      </Box>
    );
  };

  const renderPostHeader = () => {
    return (
      <Box
        px={{ base: 4, md: 6 }}
        pt={{ base: 4, md: 6 }}
        pb={{ base: 3, md: 4 }}
      >
        <Flex justify="space-between" align="flex-start" gap={3}>
          <HStack
            spacing={{ base: 2, md: 3 }}
            flex={1}
            align="flex-start"
            minW={0}
          >
            <Box position="relative" flexShrink={0}>
              <Avatar
                size={{ base: "md", md: "lg" }}
                name={post.author?.username}
                src={post.author?.photoURL || "https://bit.ly/3kkJrly"}
                border="2px solid"
                borderColor={post.author?.online ? "green.400" : "gray.200"}
                transition="border-color 0.2s"
              />
              {post.author?.online && (
                <Box
                  position="absolute"
                  bottom="2px"
                  right="2px"
                  w={{ base: "10px", md: "14px" }}
                  h={{ base: "10px", md: "14px" }}
                  bg="green.400"
                  border="2px solid white"
                  borderRadius="full"
                />
              )}
            </Box>

            <VStack align="flex-start" spacing={1} flex={1} minW={0}>
              <HStack spacing={2} align="center" w="full" minW={0}>
                <Text
                  as={Link}
                  to={`/user/${post.authorID}`}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="700"
                  color="gray.900"
                  textTransform="capitalize"
                  _hover={{
                    textDecoration: "underline",
                    color: "blue.600",
                  }}
                  transition="color 0.2s"
                  isTruncated
                  flex={1}
                  minW={0}
                >
                  {post.author?.username}
                </Text>

                {IsFollowing && userCredential._id !== post?.authorID && (
                  <Button
                    size={{ base: "xs", md: "sm" }}
                    variant="outline"
                    colorScheme="blue"
                    borderRadius="full"
                    fontWeight="600"
                    px={{ base: 2, md: 4 }}
                    onClick={onFollowUser}
                    _hover={{
                      bg: "blue.50",
                      borderColor: "blue.400",
                    }}
                    flexShrink={0}
                    display={{ base: "none", sm: "flex" }}
                  >
                    + Follow
                  </Button>
                )}
              </HStack>

              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="gray.600"
                fontWeight="500"
                textTransform="capitalize"
                isTruncated
                w="full"
              >
                {post.author?.bio || post.author?.email}
              </Text>

              <HStack
                spacing={2}
                color="gray.500"
                fontSize={{ base: "xs", md: "sm" }}
                flexWrap="wrap"
              >
                <Text fontWeight="500">{CalcTime(post?.createdAt)}</Text>
                {post.edited && (
                  <>
                    <Text>•</Text>
                    <Text>Edited</Text>
                  </>
                )}
                <Text>•</Text>
                <HStack spacing={1}>
                  <MdPublic size={12} />
                  <Text>Public</Text>
                </HStack>
              </HStack>

              {/* Mobile Follow Button */}
              {IsFollowing && userCredential._id !== post?.authorID && (
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme="blue"
                  borderRadius="full"
                  fontWeight="600"
                  px={3}
                  onClick={onFollowUser}
                  _hover={{
                    bg: "blue.50",
                    borderColor: "blue.400",
                  }}
                  display={{ base: "flex", sm: "none" }}
                  mt={1}
                >
                  + Follow
                </Button>
              )}
            </VStack>
          </HStack>
          {renderPostMenu()}
        </Flex>
      </Box>
    );
  };

  const renderPostContent = () => {
    return (
      <Box px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }}>
        {post.title && (
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="700"
            color="gray.900"
            mb={{ base: 3, md: 4 }}
            lineHeight="1.5"
            wordBreak="break-word"
          >
            {post.title}
          </Text>
        )}

        {post.description && (
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.700"
            mb={{ base: 3, md: 4 }}
            lineHeight="1.6"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
          >
            {expanded ? post.description : truncatedDescription}
            {post.description.length > 200 && (
              <Text
                as="span"
                color="blue.600"
                cursor="pointer"
                fontWeight="600"
                ml={1}
                onClick={() => setExpanded(!expanded)}
                _hover={{ textDecoration: "underline" }}
              >
                {expanded ? " Show less" : " Show more"}
              </Text>
            )}
          </Text>
        )}

        {post.content && (
          <Box
            mt={{ base: 3, md: 4 }}
            borderRadius="xl"
            overflow="hidden"
            bg="gray.50"
            position="relative"
            w="100%"
            cursor="zoom-in"
            onClick={() => setShowFullScreen(true)}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.02)" }}
          >
            <Image
              src={post.content}
              alt={post.title || "Post image"}
              w="100%"
              h="auto"
              maxH={{ base: "300px", md: "500px" }}
              objectFit="cover"
              loading="lazy"
            />

            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              opacity={0}
              transition="opacity 0.2s"
              _hover={{ opacity: 1 }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                aria-label="View full image"
                icon={<BiExpand />}
                variant="solid"
                colorScheme="whiteAlpha"
                size={{ base: "md", md: "lg" }}
                borderRadius="full"
                _hover={{ transform: "scale(1.1)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullScreen(true);
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  // Full Screen Image Modal Component (separate from post content)
  const renderFullScreenModal = () => {
    if (!showFullScreen) return null;

    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        bg="blackAlpha.900"
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => setShowFullScreen(false)}
        cursor="zoom-out"
        overflow="auto"
      >
        <Box
          position="relative"
          width="95vw"
          height="95vh"
          maxW="95vw"
          maxH="95vh"
          p={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={post.content}
            alt={post.title || "Post image"}
            width="100%"
            height="100%"
            objectFit="contain"
            borderRadius="lg"
          />
          <IconButton
            aria-label="Close full screen"
            icon={<AiOutlineClose />}
            position="absolute"
            top={2}
            right={2}
            variant="solid"
            colorScheme="blackAlpha"
            size="lg"
            borderRadius="full"
            color="white"
            bg="blackAlpha.700"
            _hover={{
              bg: "blackAlpha.800",
              transform: "scale(1.1)",
            }}
            onClick={() => setShowFullScreen(false)}
          />
        </Box>
      </Box>
    );
  };

  const renderPostFooter = () => {
    return (
      <Box>
        {/* Engagement Stats */}
        {(post.likes > 0 || (comments && comments.length > 0)) && (
          <Box px={6} pb={3}>
            <HStack justify="space-between" align="center">
              <HStack spacing={1}>
                {post.likes > 0 && (
                  <HStack spacing={2}>
                    <Box
                      bg="blue.500"
                      color="white"
                      borderRadius="full"
                      w={6}
                      h={6}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xs"
                    >
                      👍
                    </Box>
                    <Text color="gray.600" fontSize="sm" fontWeight="500">
                      {post.likes} {post.likes === 1 ? "like" : "likes"}
                    </Text>
                  </HStack>
                )}
              </HStack>

              <HStack spacing={4} color="gray.600" fontSize="sm">
                {comments && comments.length > 0 && (
                  <Text
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    fontWeight="500"
                    onClick={onToggleComments}
                  >
                    {comments.length}{" "}
                    {comments.length === 1 ? "comment" : "comments"}
                  </Text>
                )}
              </HStack>
            </HStack>
          </Box>
        )}

        {/* Divider */}
        <Box as="hr" borderColor="gray.200" />

        {/* Action Buttons */}
        <Box px={{ base: 3, md: 4 }} py={{ base: 2, md: 3 }}>
          <HStack spacing={0} justify="space-between" flexWrap="wrap">
            {/* continuing with action buttons... */}
            <Button
              variant="ghost"
              size="lg"
              color={IsLikedPost ? "blue.500" : "gray.600"}
              onClick={handleLikeToggle}
              leftIcon={IsLikedPost ? <AiFillLike /> : <AiOutlineLike />}
              fontWeight="600"
              borderRadius="lg"
              px={6}
              py={3}
              _hover={{
                bg: IsLikedPost ? "blue.50" : "gray.50",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
              flex={1}
              justifyContent="center"
            >
              Like
            </Button>

            <Button
              variant="ghost"
              size="lg"
              color="gray.600"
              onClick={onToggleComments}
              leftIcon={<BiCommentDots />}
              fontWeight="600"
              borderRadius="lg"
              px={6}
              py={3}
              _hover={{
                bg: "gray.50",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
              flex={1}
              justifyContent="center"
            >
              Comment
            </Button>

            <Button
              variant="ghost"
              size="lg"
              color={success ? "green.500" : "gray.600"}
              onClick={() =>
                copyToClipboard(
                  `${import.meta.env.VITE_WEBSITE_URL}/post/${post?._id}`
                )
              }
              leftIcon={success ? <IoCheckmarkDoneSharp /> : <FaShare />}
              fontWeight="600"
              borderRadius="lg"
              px={6}
              py={3}
              _hover={{
                bg: success ? "green.50" : "gray.50",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
              flex={1}
              justifyContent="center"
              display={{ base: "none", md: "flex" }}
            >
              {success ? "Copied" : "Share"}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              color="gray.600"
              leftIcon={<FaRegBookmark />}
              fontWeight="600"
              borderRadius="lg"
              px={6}
              py={3}
              _hover={{
                bg: "gray.50",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
              flex={1}
              justifyContent="center"
              display={{ base: "none", md: "flex" }}
            >
              Save
            </Button>
          </HStack>
        </Box>
      </Box>
    );
  };

  const renderComments = () => {
    if (!showComments) return null;

    return (
      <>
        <Box as="hr" borderColor="gray.200" />
        <Box bg="gray.50" px={{ base: 4, md: 6 }} py={{ base: 4, md: 5 }}>
          {onCreateComment && (
            <Box mb={{ base: 4, md: 5 }}>
              <CommentForm autoFocus={isFullView} onSubmit={onCreateComment} />
            </Box>
          )}

          {((comments && comments.length > 0) ||
            (post?.RootComments && post.RootComments.length > 0)) && (
            <CommentsList
              comments={comments || post?.RootComments || []}
              replies={replies || post?.Replies || {}}
            />
          )}
        </Box>
      </>
    );
  };

  return (
    <>
      <Box
        as="article"
        bg="white"
        borderRadius="2xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "lg",
          borderColor: "gray.300",
          transform: "translateY(-2px)",
        }}
        maxW="100%"
        w="100%"
        mx="auto"
        {...containerProps}
      >
        {renderPostHeader()}
        {renderPostContent()}
        {renderPostFooter()}
        {renderComments()}
      </Box>

      {/* Render modals outside the main post container */}
      {renderFullScreenModal()}
      {isOpen && <PostModal mode="update" post={post} onClose={onClose} />}
    </>
  );
}

export default PostComponent;
