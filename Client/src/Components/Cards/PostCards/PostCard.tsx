import { followUser } from "../../../Redux/Auth/auth.actions";
import * as commentAction from "../../../Redux/Post/comment.actions";
import * as postAction from "../../../Redux/Post/post.actions";
import { useDispatch, useSelector } from "react-redux";
import UseToastMsg from "../../../Custom-Hooks/Toast";
import { useNavigate } from "react-router-dom";
import { IPost } from "../../../Constants/constant";
import { RootState } from "../../../Redux/store";
import { useState } from "react";
import { Dispatch } from "redux";
import PostComponent from "../../Common/PostComponent";
import "./PostCard.css";

type Props = {
  post: IPost;
  IsLikedPost: boolean;
  IsFollowing: boolean;
};

function PostCard({ post, IsLikedPost, IsFollowing }: Props) {
  const navigate = useNavigate();
  const { Toast } = UseToastMsg();
  const [like, setLike] = useState(post.likes);
  const dispatch: Dispatch<any> = useDispatch();
  const [showComments, setComments] = useState<boolean>(false);
  const { userCredential } = useSelector((store: RootState) => store.auth);

  const onCreateComment = (message: string) => {
    if (!userCredential._id) return navigate("/login");
    const data = {
      message,
      postID: post._id,
      author: userCredential._id,
      authorID: userCredential._id,
    };
    dispatch(commentAction.createComment(data));
  };

  const DeletePost = () => {
    if (!userCredential._id) return navigate("/login");
    dispatch(postAction.deletePost(post._id));
  };

  const FollowUser = () => {
    if (!userCredential._id) return navigate("/login");

    const data = {
      userID: userCredential._id,
      followingID: post.authorID,
    };
    dispatch(followUser(data, Toast));
  };

  const LikePost = () => {
    if (!userCredential._id) return navigate("/login");

    dispatch(postAction.likePost(post._id, userCredential._id));
    dispatch(postAction.getAllPost());
    setLike(like + 1);
  };

  const UnLikePost = () => {
    if (!userCredential._id) return navigate("/login");

    dispatch(postAction.unLikePost(post._id, userCredential._id));
    dispatch(postAction.getAllPost());
    setLike(like - 1);
  };

  return (
    <PostComponent
      post={post}
      IsLikedPost={IsLikedPost}
      IsFollowing={IsFollowing}
      showComments={showComments}
      onToggleComments={() => setComments((v) => !v)}
      onLikePost={LikePost}
      onUnlikePost={UnLikePost}
      onDeletePost={DeletePost}
      onFollowUser={FollowUser}
      onCreateComment={onCreateComment}
      comments={post?.RootComments}
      replies={post?.Replies}
      isFullView={false}
      containerProps={{
        mb: 4,
        maxW: "600px",
        mx: "auto",
      }}
    />
  );
}

export default PostCard;
