import { connect } from 'react-redux';
import { makeSelectClaimIsMine, selectMyChannelClaims } from 'lbry-redux';
import { makeSelectRepliesForParentId } from 'redux/selectors/comments';
import { withRouter } from 'react-router';

import CommentsReplies from './view';

const select = (state, props) => {
  return {
    myChannels: selectMyChannelClaims(state),
    comments: makeSelectRepliesForParentId(props.parentId)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  };
};

export default withRouter(connect(select, null)(CommentsReplies));
