import { Box } from "@chakra-ui/react";
import { IComment } from "../../../Constants/constant";
import Comment from "./Comment";

type Props = {
  comments: IComment[];
  replies: IComment[];
};

function CommentsList({ comments, replies }: Props) {
  return (
    <Box>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} replies={replies} />
      ))}
    </Box>
  );
}

export default CommentsList;
