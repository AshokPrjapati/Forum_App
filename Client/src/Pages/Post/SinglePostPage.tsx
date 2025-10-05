import { Box } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { IComment, IFollow, ILikes } from "../../Constants/constant";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Dispatch } from "redux";
import {
  deletePost,
  likePost,
  postLikes,
  unLikePost,
} from "../../Redux/Post/post.actions";
import Navbar from "../../Components/Navbar/Navbar";
import { followUser } from "../../Redux/Auth/auth.actions";
import UseToastMsg from "../../Custom-Hooks/Toast";
import { createComment } from "../../Redux/Post/comment.actions";
import Loader from "../../Components/Loader/Loader";
import PostComponent from "../../Components/Common/PostComponent";

function SinglePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { Toast } = UseToastMsg();
  const [post, setPost] = useState<any>({});
  const dispatch: Dispatch<any> = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const { likes } = useSelector((store: RootState) => store.post);
  const [showComments, setShowComments] = useState<boolean>(false);
  const { userCredential, following } = useSelector(
    (store: RootState) => store.auth
  );

  useEffect(() => {
    fetchPost();

    if (!userCredential._id) return;
    dispatch(postLikes(userCredential._id));
  }, []);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/post/${id}`);
      setPost(response.data.post);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const DeletePost = () => {
    if (!userCredential._id) return navigate("/login");
    dispatch(deletePost(post._id));
    navigate("/");
  };

  const GroupLikedPost = useMemo(() => {
    if (!likes) return;
    const group: any = {};
    likes.forEach((check: ILikes) => {
      group[check.postID] = check;
    });
    return group;
  }, [likes]);

  const IsLikedPost = (id: string) => {
    return GroupLikedPost[id] !== undefined;
  };

  const FollowingGroup = useMemo(() => {
    if (!following) return;
    const group: any = {};
    following.forEach((check: IFollow) => {
      group[check.followingID] = check;
    });
    return group;
  }, [following]);

  const IsFollowing = (id: string) => {
    return FollowingGroup[id] == undefined;
  };

  const FollowUser = () => {
    if (!userCredential._id) return navigate("/login");

    const data = {
      userID: userCredential._id,
      followingID: post.authorID,
    };
    console.log("data: ", data);
    dispatch(followUser(data, Toast));
  };

  const onCreateComment = (message: string) => {
    if (!userCredential._id) return navigate("/login");
    const data = {
      message,
      postID: post._id,
      author: userCredential._id,
      authorID: userCredential._id,
    };
    dispatch(createComment(data));
    setTimeout(fetchPost, 1000);
  };

  const LikePost = () => {
    if (!userCredential._id) return navigate("/login");

    dispatch(likePost(post._id, userCredential._id));
    setTimeout(fetchPost, 1000);
  };

  const UnLikePost = () => {
    if (!userCredential._id) return navigate("/login");

    dispatch(unLikePost(post._id, userCredential._id));
    setTimeout(fetchPost, 1000);
  };

  const FinalPostComments: any = useMemo(() => {
    if (post?.comments == null) return {};

    const group: any = {};

    post.comments?.forEach((comment: any) => {
      if (!group[comment?.parentID]) {
        group[comment?.parentID] = [];
      }
      group[comment?.parentID].push(comment);
    });

    const { null: RootComments, ...Replies } = group;

    if (RootComments) {
      RootComments.sort(
        (a: IComment, b: IComment) => b.createdAt - a.createdAt
      );
    }

    return { RootComments, Replies };
  }, [post?.comments]);

  if (!post || loading)
    return (
      <>
        <Navbar />
        <Box maxW="600px" mx="auto" py={8}>
          <Loader />
        </Box>
      </>
    );

  return (
    <>
      <Navbar />
      <Box maxW="600px" mx="auto" py={8} px={4}>
        <PostComponent
          post={post}
          IsLikedPost={IsLikedPost(post._id)}
          IsFollowing={IsFollowing(post?.authorID)}
          showComments={showComments}
          onToggleComments={() => setShowComments((v) => !v)}
          onLikePost={LikePost}
          onUnlikePost={UnLikePost}
          onDeletePost={DeletePost}
          onFollowUser={FollowUser}
          onCreateComment={onCreateComment}
          comments={FinalPostComments.RootComments}
          replies={FinalPostComments.Replies}
          isFullView={true}
          containerProps={{
            boxShadow: "lg",
            borderWidth: "1px",
            borderColor: "gray.200",
          }}
        />
      </Box>
    </>
  );
}

export default SinglePostPage;
