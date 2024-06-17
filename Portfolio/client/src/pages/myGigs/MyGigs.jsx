import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/portfolios?userId=${currentUser._id}`).then((res) => res.data),
  });

  const mutationDelete = useMutation({
    mutationFn: (id) => newRequest.delete(`/portfolios/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["myGigs"]),
  });

  const handleView = (id) => navigate(`/gig/${id}`);
  const handleDelete = (id) => mutationDelete.mutate(id);
  const handleEdit = (id) => navigate(`/editportfolio/${id}`);

  if (isLoading) return <div className="myGigs">Loading...</div>;
  if (error) return <div className="myGigs">An error occurred: {error.message}</div>;

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>Portfolios</h1>
          {currentUser && (
            <Link to="/add">
              <button>Add New Portfolio</button>
            </Link>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((portfolio) => (
                <tr key={portfolio._id}>
                  <td>
                    <img className="image" src={portfolio.cover} alt={portfolio.title} />
                  </td>
                  <td>{portfolio.title}</td>
                  <td>
                    <div className="actions">
                      <img
                        className="view"
                        src="./img/view.png"
                        alt="view"
                        onClick={() => handleView(portfolio._id)}
                      />
                      <img
                        className="edit"
                        src="./img/edit.png"
                        alt="Edit"
                        onClick={() => handleEdit(portfolio._id)}
                      />
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt="Delete"
                        onClick={() => handleDelete(portfolio._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No portfolio found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyGigs;
