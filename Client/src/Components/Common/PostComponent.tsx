import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  ListItem,
  Text,
  UnorderedList,
  AspectRatio,
  BoxProps,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { CalcTime } from "../../helper/helper";
import CommentForm from "../Cards/Comments/CommentForm";
import CommentsList from "../Cards/Comments/CommentsList";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { AiFillLike } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import { BiCommentDots, BiLike } from "react-icons/bi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import useToggle from "../../Custom-Hooks/useToggle";
import PostModal from "../../Pages/Post/PostModal";
import useCopyToClipboard from "../../Custom-Hooks/useCopyToClipboard";
import "../Cards/PostCards/PostCard.css";

interface PostComponentProps {
  post: any;
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
  const navigate = useNavigate();
  const [copyToClipboard, { value, success }]: any = useCopyToClipboard();
  const { userCredential } = useSelector((store: RootState) => store.auth);
  const [isOpen, onOpen, onClose]: any = useToggle(false);

  const handleLikeToggle = () => {
    if (IsLikedPost) {
      onUnlikePost?.();
    } else {
      onLikePost?.();
    }
  };

  const renderPostHeader = () => {
    return (
      <Flex as="header" gap={3} pb="3" px={4} pt={4}>
        <Link to={`/user/${post.authorID}`}>
          <Flex gap={3} align="flex-start">
            <Box className={post.author?.online ? "online" : "offline"}>
              <Box className="post-header-image">
                <Avatar
                  bg="purple.400"
                  color="blackAlpha.800"
                  boxSize="48px"
                  name={post.author?.username}
                  src={post.author?.photoURL || "https://bit.ly/3kkJrly"}
                />
              </Box>
            </Box>
            <Box className="post-header-details" flex="1" minW="0">
              <Flex align="center" gap="8px" mb="1">
                <Text
                  fontSize="md"
                  fontWeight="600"
                  whiteSpace="nowrap"
                  textTransform="capitalize"
                  _hover={{ textDecor: "underline" }}
                  color="gray.900"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {post.author?.username}
                </Text>
                {post.author?.online && (
                  <Flex
                    fontSize="xs"
                    color="green.500"
                    align="center"
                    gap="1"
                    bg="green.50"
                    px="2"
                    py="1"
                    borderRadius="full"
                  >
                    <Box
                      bg="green.500"
                      borderRadius="50%"
                      h="6px"
                      w="6px"
                    ></Box>
                    <Text fontWeight="500">Online</Text>
                  </Flex>
                )}
              </Flex>
              <Text
                fontSize="sm"
                fontWeight="500"
                color="gray.600"
                textTransform="capitalize"
                mb="1"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {post.author?.bio || post.author?.email}
              </Text>
              <Flex align="center" gap="2" fontSize="sm" color="gray.500">
                <Text>{CalcTime(post?.createdAt)}</Text>
                {post.edited && (
                  <>
                    <Text>•</Text>
                    <Text>Edited</Text>
                  </>
                )}
              </Flex>
            </Box>
          </Flex>
        </Link>
        <Flex ml="auto" align="flex-start" gap="2">
          {IsFollowing && userCredential._id !== post?.authorID && (
            <Button
              size="sm"
              variant="outline"
              onClick={onFollowUser}
              borderRadius="full"
              colorScheme="blue"
            >
              + Follow
            </Button>
          )}
          <Box className="post-options-menu">
            <Box className="hamberger-menu">
              <Text></Text>
              <Text></Text>
              <Text></Text>
            </Box>
            <Box className="post-options-list">
              <UnorderedList fontWeight="semibold">
                <ListItem>Report</ListItem>
                {post?.authorID === userCredential._id && (
                  <>
                    <ListItem className="edit-btn">
                      <Button
                        w="100%"
                        h="100%"
                        p=".5em"
                        pl=".75em"
                        variant="unstyled"
                        textAlign="left"
                        onClick={onOpen}
                      >
                        Edit
                      </Button>
                    </ListItem>
                    <ListItem onClick={onDeletePost}>Delete</ListItem>
                  </>
                )}
                <ListItem>Save</ListItem>
              </UnorderedList>
            </Box>
          </Box>
        </Flex>
      </Flex>
    );
  };

  const renderPostContent = () => {
    return (
      <Box as="section" px={4} pb="3">
        {/* Title */}
        {post?.title && (
          <Text
            className="post-content-title"
            fontSize="lg"
            fontWeight="600"
            mb="2"
            lineHeight="1.4"
            color="gray.900"
          >
            {post.title}
          </Text>
        )}

        {/* Description */}
        {post?.description && (
          <Box
            className="post-content-description"
            mb={post?.content ? "3" : "0"}
          >
            <Text
              className="post-content-message"
              fontSize="md"
              lineHeight="1.6"
              color="gray.700"
              whiteSpace="pre-wrap"
            >
              {post.description}
            </Text>
            {!isFullView && post?.description.length > 150 && (
              <Box className="expand-btn">
                <input type="checkbox" data-expand-btn="true" />
              </Box>
            )}
          </Box>
        )}

        {/* Image */}
        {post?.content && (
          <Box
            className="post-content-image"
            onClick={
              !isFullView ? () => navigate(`/post/${post._id}`) : undefined
            }
            cursor={!isFullView ? "pointer" : "default"}
          >
            <Box
              borderRadius="lg"
              overflow="hidden"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
            >
              <Image
                src={post.content}
                w="100%"
                objectFit={isFullView ? "contain" : "cover"}
                maxH={isFullView ? "600px" : "400px"}
                minH="200px"
                fallback={
                  <AspectRatio ratio={16 / 9} bg="gray.100">
                    <Flex align="center" justify="center">
                      <Text color="gray.500" fontSize="sm">
                        Image not available
                      </Text>
                    </Flex>
                  </AspectRatio>
                }
                loading="lazy"
                transition="transform 0.2s"
                _hover={!isFullView ? { transform: "scale(1.02)" } : {}}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const renderPostFooter = () => {
    return (
      <Box>
        {/* Divider */}
        <Box h="1px" bg="gray.200" mx={4} />

        <Flex as="footer" p="2" className="post-footer">
          <Flex
            className="user-select-reject"
            tabIndex={0}
            color={IsLikedPost ? "blue.500" : "gray.600"}
            onClick={handleLikeToggle}
            align="center"
            gap="2"
            flex={1}
            justify="center"
            p="3"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            transition="all 0.2s"
          >
            <Text fontSize="xl">
              {IsLikedPost ? <AiFillLike /> : <BiLike />}
            </Text>
            <Text fontSize="md" fontWeight="600">
              {post.likes > 0 && (
                <Text as="span" mr="1">
                  {post.likes}
                </Text>
              )}
              Like
            </Text>
          </Flex>

          <Flex
            className="user-select-reject"
            onClick={onToggleComments}
            align="center"
            gap="2"
            flex={1}
            justify="center"
            p="3"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            transition="all 0.2s"
            color="gray.600"
          >
            <Text fontSize="xl">
              <BiCommentDots />
            </Text>
            <Text fontSize="md" fontWeight="600">
              Comment
            </Text>
          </Flex>

          <Flex
            color={success ? "green.500" : "gray.600"}
            onClick={() =>
              copyToClipboard(
                `${import.meta.env.VITE_WEBSITE_URL}/post/${post?._id}`
              )
            }
            className="user-select-reject"
            align="center"
            gap="2"
            flex={1}
            justify="center"
            p="3"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            transition="all 0.2s"
          >
            <Text fontSize="xl">
              {success ? <IoCheckmarkDoneSharp /> : <FaShare />}
            </Text>
            <Text fontSize="md" fontWeight="600">
              {success ? "Copied" : "Share"}
            </Text>
          </Flex>
        </Flex>
      </Box>
    );
  };

  const renderComments = () => {
    if (!showComments) return null;

    return (
      <>
        <Box h="1px" bg="gray.200" mx={4} />
        <Box
          as="section"
          className="comments-container"
          bg="gray.50"
          px={4}
          py="4"
        >
          {onCreateComment && (
            <Box mb="4">
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
        border="1px"
        borderColor="gray.200"
        borderRadius={{ base: "lg", md: "xl" }}
        overflow="hidden"
        boxShadow="sm"
        _hover={{ boxShadow: "md", borderColor: "gray.300" }}
        transition="all 0.2s"
        {...containerProps}
      >
        {renderPostHeader()}
        {renderPostContent()}
        {renderPostFooter()}
        {renderComments()}
      </Box>

      {isOpen && <PostModal mode="update" post={post} onClose={onClose} />}
    </>
  );
}

export default PostComponent;
