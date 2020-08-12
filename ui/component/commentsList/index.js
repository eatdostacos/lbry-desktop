import { connect } from 'react-redux';
import { makeSelectClaimIsMine, selectMyChannelClaims } from 'lbry-redux';
import {
  makeSelectTopLevelCommentsForUri,
  selectIsFetchingComments,
  makeSelectCommentForCommentId,
} from 'redux/selectors/comments';
import { doCommentList } from 'redux/actions/comments';
import { withRouter } from 'react-router';

import CommentsList from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const linkedCommentId =
    Number(urlParams.get('lc')) || '979ee72cc379497453298b32e25ea8ebf201f4f11654b21451c2b35f2bafbdd0';

  return {
    myChannels: selectMyChannelClaims(state),
    linkedComment: makeSelectCommentForCommentId(linkedCommentId)(state),
    comments: makeSelectTopLevelCommentsForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    isFetchingComments: selectIsFetchingComments(state),
  };
};

const perform = dispatch => ({
  fetchComments: uri => dispatch(doCommentList(uri)),
});

export default withRouter(connect(select, perform)(CommentsList));
