import React, { useState } from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();
  const [showContactInfo, setShowContactInfo] = useState(false);

  const { isLoading, error, data } = useQuery(["portfolio"], () =>
    newRequest.get(`/portfolios/single/${id}`).then((res) => res.data)
  );

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery(
    ["user", userId],
    () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    {
      enabled: !!userId,
    }
  );

  const handleContactClick = () => setShowContactInfo(!showContactInfo);

  const renderSocialMediaIcon = (link) => {
    if (link.includes("twitter.com")) {
      return <img src="/img/twitter.png" alt="Twitter" />;
    } else if (link.includes("facebook.com")) {
      return <img src="/img/facebook.png" alt="Facebook" />;
    } else if (link.includes("linkedin.com")) {
      return <img src="/img/linkedin.png" alt="LinkedIn" />;
    } else if (link.includes("pinterest.com")) {
      return <img src="/img/pinterest.png" alt="Pinterest" />;
    } else if (link.includes("instagram.com")) {
      return <img src="/img/instagram.png" alt="Instagram" />;
    }
    return null;
  };

  if (isLoading || isLoadingUser) return <div>Loading...</div>;
  if (error || errorUser) return <div>Something went wrong!</div>;

  return (
    <>
      <div className="page-container">
        <div className="top-section">
          <div className="left">
            {data.images && (
              <Slider slidesToShow={1} arrowsScroll={1} className="slider">
                {data.images.map((img) => (
                  <img key={img} src={img} alt="" />
                ))}
              </Slider>
            )}
          </div>
          <div className="right">
            <div className="card user-info">
              <div className="user-info-content">
                <img
                  className="pp"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt="profile pic"
                />
                <div className="user-details">
                  <h2>{dataUser.username}</h2>
                  <p>{dataUser.role}</p>
                  {!isNaN(data.totalStars / data.starNumber) && (
                    <div className="stars">
                      {Array(Math.round(data.totalStars / data.starNumber))
                        .fill()
                        .map((_, i) => (
                          <img src="/img/star.png" alt="" key={i} />
                        ))}
                      <span>{Math.round(data.totalStars / data.starNumber)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="short-desc">
                <h2>{data.title}</h2>
                <p>{data.shortDesc}</p>
              </div>
            </div>
          </div>
        </div>
        <h1>About Me</h1>
        <div className="card oia">
          <div className="left-oia">
            <div className="about-me">
              <p>{data.desc}</p>
            </div>
            <button onClick={handleContactClick}>Contact Me</button>
            {showContactInfo && (
              <div className="contact-info">
                {dataUser.email && <p>Email: {dataUser.email}</p>}
                {dataUser.phone && <p>Phone: {dataUser.phone}</p>}
                {dataUser.address && <p>Address: {dataUser.address}</p>}
              </div>
            )}
            <div className="reviews">
              <h2>Rate My Works</h2>
              <Reviews portfolioId={id} />
            </div>
          </div>
          <div className="right-oia">
            <div className="skills">
              <h2>Skills</h2>
              {data.skills ? (
                <ul>
                  {data.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p>No skills listed.</p>
              )}
            </div>
            <div className="education">
              <h2>Education</h2>
              {data.educations ? (
                <ul>
                  {data.educations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No education listed.</p>
              )}
            </div>
            <div className="experience">
              <h2>Experience</h2>
              {data.experiences ? (
                <ul>
                  {data.experiences.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No experience listed.</p>
              )}
            </div>
            <div className="social-media">
              <h2>Social Media</h2>
              {data.socialMedia ? (
                <ul>
                  {data.socialMedia.map((link) => (
                    <li key={link}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {renderSocialMediaIcon(link)}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No social media links listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gig;
