import React, { useState, useEffect } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["portfolios", sort, search],
    queryFn: () =>
      newRequest
        .get(`/portfolios${search}&sort=${sort}`)
        .then((res) => {
          return res.data;
        }),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort, search, refetch]);

  return (
    <div className="gigs">
      <div className="container">
        <h1 className="title">All Portfolio</h1>
        <p className="description">Explore the Boundaries of Professionalism and Technology with the GearStream Platform</p>
        <div className="menu">
        <div className="left">
        </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Popularity" : "Newest"}
            </span>
            <img src="./img/down.png" alt="sort icon" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Popular</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
