import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import "./Review.scss";

const Review = ({ review }) => {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest.get(`/users/${review.userId}`).then((res) => res.data),
  });

  const [helpfulState, setHelpfulState] = useState(null);

  const mutationHelpful = useMutation({
    mutationFn: () => newRequest.post(`/reviews/${review._id}/helpful`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", review.portfolioId]);
      setHelpfulState("yes");
    },
  });

  const mutationNotHelpful = useMutation({
    mutationFn: () => newRequest.post(`/reviews/${review._id}/not-helpful`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", review.portfolioId]);
      setHelpfulState("no");
    },
  });

  const handleHelpfulClick = () => {
    if (helpfulState === null) {
      mutationHelpful.mutate();
    }
  };

  const handleNotHelpfulClick = () => {
    if (helpfulState === null) {
      mutationNotHelpful.mutate();
    }
  };

  return (
    <div className="review-card">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="user">
          <img className="pp" src={data.img || "/img/noavatar.jpg"} alt="" />
          <div className="info">
            <span>{data.username}</span>
            <div className="country">
              <span>from {data.City}</span>
            </div>
          </div>
        </div>
      )}
      <div className="stars">
        {Array(review.star)
          .fill()
          .map((_, i) => (
            <img src="/img/star.png" alt="star" key={i} />
          ))}
        <span>{review.star}</span>
      </div>
      <p>{review.desc}</p>
      
    </div>
  );
};

export default Review;
