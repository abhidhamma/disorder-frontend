import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useInput from '../../Hooks/useInput';
import PostPresenter from './PostPresenter';
import { useMutation } from '@apollo/react-hooks';
import { TOGGLE_LIKE, ADD_COMMENT } from './PostQueries';
import { toast } from 'react-toastify';

const PostContainer = ({
  id,
  user,
  files,
  likeCount,
  comments,
  createdAt,
  caption,
  title,
  isLiked,
}) => {
  const [isLikedS, setIsLiked] = useState(isLiked);
  const [likeCountS, setLikeCount] = useState(likeCount);
  const [currentItem, setCurrentItem] = useState(0);
  const [selfComments, setSelfComments] = useState([]);
  const comment = useInput('');
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    variables: { postId: id },
  });
  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    variables: { postId: id, text: comment.value },
  });
  useEffect(() => {
    const totalFiles = files.length;
    if (currentItem === totalFiles - 1) {
      setCurrentItem(0);
    } else {
      setCurrentItem(currentItem + 1);
    }
  }, [currentItem, files]);

  const toggleLike = () => {
    try {
      toggleLikeMutation();
      if (isLikedS === true) {
        setIsLiked(false);
        setLikeCount(likeCountS - 1);
      } else {
        setIsLiked(true);
        setLikeCount(likeCountS + 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onKeyPress = async event => {
    const { which } = event;
    if (which === 13) {
      event.preventDefault();
      try {
        const {
          data: { addComment },
        } = await addCommentMutation();
        setSelfComments([...selfComments, addComment]);
        comment.setValue('');
      } catch (e) {
        console.log(e);
        toast.error(e);
      }
    }
  };

  return (
    <PostPresenter
      isLiked={isLikedS}
      user={user}
      files={files}
      onKeyPress={onKeyPress}
      likeCount={likeCountS}
      title={title}
      caption={caption}
      createdAt={createdAt}
      currentItem={currentItem}
      toggleLike={toggleLike}
      newComment={comment}
      comments={comments}
      setIsLiked={setIsLiked}
      setLikeCount={setLikeCount}
      selfComments={selfComments}
    />
  );
};

PostContainer.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  title: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
};

export default PostContainer;
