import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";

const Reviews = ({ portfolioId }) => {
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [errorMessage, setErrorMessage] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews", portfolioId],
    queryFn: () =>
      newRequest.get(`/reviews/${portfolioId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", portfolioId]);
      setEditingReview(null);
      setReviewText("");
      setReviewStar(5);
      setErrorMessage("");
    },
    onError: (error) => {
      if (error.response && error.response.status === 403) {
        setErrorMessage("You have already submitted a review.");
      } else {
        setErrorMessage("You need to log in to submit a review.");
      }
    }
  });

  const [editingReview, setEditingReview] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewStar, setReviewStar] = useState(5);

  useEffect(() => {
    if (editingReview) {
      setReviewText(editingReview.desc);
      setReviewStar(editingReview.star);
    } else {
      setReviewText("");
      setReviewStar(5);
    }
  }, [editingReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    if (editingReview) {
      newRequest
        .put(`/reviews/${editingReview._id}`, { desc: reviewText, star: reviewStar })
        .then(() => {
          queryClient.invalidateQueries(["reviews", portfolioId]);
          setEditingReview(null);
          setReviewText("");
          setReviewStar(5);
          setErrorMessage("");
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            setErrorMessage("You have already submitted a review.");
          } else {
            setErrorMessage("You need to log in to update the review.");
          }
        });
    } else {
      mutation.mutate({ portfolioId, desc: reviewText, star: reviewStar });
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleStarClick = (index) => {
    setReviewStar(index + 1);
  };

  if (isLoading) return "loading";
  if (error) return "Something went wrong!";

  const userReview = data.find((review) => review.userId === currentUser?.id);

  return (
    <div className="reviews-container">
      <h2>Reviews</h2>
      {data.map((review) => (
        <div key={review._id} className="review-card">
          <Review review={review} />
          {review.userId === currentUser?.id && (
            <button className="edit-button" onClick={() => handleEdit(review)}>Edit</button>
          )}
        </div>
      ))}
      {!currentUser && (
        <p>You need to log in to submit a review.</p>
      )}
      {currentUser && currentUser.id !== portfolioId && !userReview && (
        <div className="add-review">
          <h3>{editingReview ? "Edit your review" : "Add a review"}</h3>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="review-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Write your opinion"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="star-rating">
              {[...Array(5)].map((_, index) => (
                <img
                  src="/img/star.png"
                  alt="star"
                  key={index}
                  className={index < reviewStar ? "filled-star" : "empty-star"}
                  onClick={() => handleStarClick(index)}
                />
              ))}
            </div>
            <button type="submit">
              {editingReview ? "Update" : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reviews;
