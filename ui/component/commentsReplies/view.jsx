// @flow
import React from 'react';
import Comment from 'component/comment';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

type Props = {
  comments: Array<any>,
  uri: string,
  claimIsMine: boolean,
  myChannels: ?Array<ChannelClaim>,
  linkedCommentId: string,
  parentId: string,
};

function CommentsReplies(props: Props) {
  const { uri, comments, claimIsMine, myChannels, linkedCommentId, parentId } = props;

  const [expanded, setExpanded] = React.useState(false);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(3);
  if (!comments) return null;

  const totalComments = comments && comments.length;

  // const linkedCommentId = '979ee72cc379497453298b32e25ea8ebf201f4f11654b21451c2b35f2bafbdd0';
  // if linkedCommentId
  //    find linkedCommentId
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

  function getIndexOfLinkedComment(comments, commentId) {
    return comments.findIndex(e => e.comment_id === commentId);
  }
  const displayedComments = (comments && comments.reverse().slice(start, end)) || [];

  return (
    <div className={'comment__replies-container'}>
      {!expanded && (
        <Button
          button={'link'}
          label={__('Show %number% Replies', { number: comments.length })}
          onClick={() => setExpanded(true)}
          icon={ICONS.DOWN}
        />
      )}
      {expanded && <Button button={'link'} label={'Hide Replies'} onClick={() => setExpanded(false)} icon={ICONS.UP} />}
      {expanded && start > 0 && (
        <Button button={'link'} label={'Show more above'} onClick={() => setStart(0)} icon={ICONS.UP} />
      )}
      {comments && displayedComments && expanded && (
        <ul className="comments">
          {displayedComments.map(comment => {
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
                highlighted={comment.comment_id === linkedCommentId}
              />
            );
          })}
        </ul>
      )}
      {expanded && comments && end < comments.length && (
        <Button button={'link'} label={'Show more below'} onClick={() => setEnd(end + 10)} icon={ICONS.DOWN} />
      )}
    </div>
  );
}

export default CommentsReplies;
