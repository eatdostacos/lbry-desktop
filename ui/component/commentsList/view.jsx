// @flow
import React, { useEffect } from 'react';
import Comment from 'component/comment';
import Spinner from 'component/spinner';
import debounce from 'util/debounce';
import { MAIN_CLASS } from 'component/page/view';

type Props = {
  comments: Array<any>,
  fetchComments: string => void,
  uri: string,
  claimIsMine: boolean,
  myChannels: ?Array<ChannelClaim>,
  isFetchingComments: boolean,
  linkedComment: any,
};

function CommentList(props: Props) {
  const { fetchComments, uri, comments, claimIsMine, myChannels, isFetchingComments, linkedComment } = props;

  const linkedCommentId = linkedComment && linkedComment.comment_id;
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(9);
  const totalComments = comments && comments.length;
  const DEBOUNCE_SCROLL_HANDLER_MS = 300;
  // const linkedCommentId = '979ee72cc379497453298b32e25ea8ebf201f4f11654b21451c2b35f2bafbdd0';

  // if (linkedComment) {
  //   if (linkedComment.parent_id) {
  //     // sort comment w/ parent_id comment_id to top
  //     // pass linked comment id to <commentReplies>
  //   } else (linkedComment.comment_id) {
  //     // sort linkedComment to top.
  //   }
  // }
  // getLinkedCommentFromCommentId
  // if linkedComment.parent_id:
  // <comment id=parent_id>
  // <commentreplies parent=parent_id linked=comment_id>
  // else
  // <comment id={linked_id}
  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  const isMyComment = (channelId: string) => {
    if (myChannels != null && channelId != null) {
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].claim_id === channelId) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    fetchComments(uri);
  }, [fetchComments, uri]);

  useEffect(() => {
    const handleScroll = debounce(e => {
      const mainEl = document.querySelector(`.${MAIN_CLASS}`);

      if (mainEl && totalComments && end - start < totalComments) {
        const contentWrapperAtBottomOfPage = mainEl.getBoundingClientRect().bottom - 0.5 <= window.innerHeight;

        if (contentWrapperAtBottomOfPage) {
          setEnd(end + 10);
        }
      }
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [start, end, setEnd, totalComments]);

  //
  function prepareComments(arrayOfComments, linkedComment) {
    let orderedComments = [];

    if (linkedComment) {
      orderedComments = arrayOfComments.filter(c => c.comment_id !== linkedComment.comment_id);
      orderedComments.unshift(linkedComment);
    } else {
      orderedComments = arrayOfComments;
    }
    return orderedComments;
  }

  const displayedComments = prepareComments(comments, linkedComment).slice(start, end);

  return (
    <ul className="comments">
      {isFetchingComments && (
        <div className="main--empty">
          <Spinner />
        </div>
      )}
      {!isFetchingComments &&
        comments &&
        displayedComments &&
        displayedComments.map(comment => {
          return (
            <Comment
              uri={uri}
              authorUri={comment.channel_url}
              author={comment.channel_name}
              claimId={comment.claim_id}
              commentId={comment.comment_id}
              key={comment.comment_id}
              message={comment.comment}
              parentId={comment.parent_id || null}
              timePosted={comment.timestamp * 1000}
              claimIsMine={claimIsMine}
              commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
              linkedCommentId={linkedCommentId}
            />
          );
        })}
    </ul>
  );
}

export default CommentList;
