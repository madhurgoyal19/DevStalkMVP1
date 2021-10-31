import { React, useState, useEffect } from "react";
import { ReactComponent as Likes } from "images/likes.svg";
import { ReactComponent as Views } from "images/views.svg";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { likeProject } from "actions/projects";
import {
  useMonetizationState,
  useMonetizationCounter,
} from "react-web-monetization";

const Thumbnail = ({ projectTagline, projectImage }) => {
  return (
    <>
      <div className="thumbnail__placeholder">
        <img className="thumbnail__img" src={projectImage} alt="temp"></img>
        <div className="thumbnail__overlay">
          <div className="information__project-tagline">
            <h2>{projectTagline}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

const Card = ({
  userName,
  userId,
  projectImage,
  projectTitle,
  projectId,
  projectTagline,
  projectLogo,
  projectLikes,
  projectViews,
  projectExclusive,
}) => {
  console.log(projectExclusive);
  const dispatch = useDispatch();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("profile"));

  const monetization = useMonetizationState();

  const LoadingCardOverlay = () => {
    return <div className="card__overlay card__loadingOverlay"></div>;
  };

  const ExclusiveSignUpCardOverlay = () => {
    return (
      <div className="card__overlay card__overlay--exclusive">
        <h3>This content is Web Monetized</h3>
        <h5>
          Sign up on Coil to enable web monetization and support creators.
        </h5>
        <a href="https://www.coil.com">Sign Up</a>
      </div>
    );
  };

  const SupportMonetizationCardOverlay = () => {
    return (
      <div className="card__overlay card__supportCardOverlay">
        <h3>This content is Web Monetized</h3>
        <h5>
          To view this content please enable your Coil Extension and Support
          Creator Economy
        </h5>
      </div>
    );
  };

  const getCardOverlay = () => {
    if (projectExclusive) {
      if (!monetization.state) return ExclusiveSignUpCardOverlay();
      else if (monetization.state === "stopped")
        return SupportMonetizationCardOverlay();
      else if (monetization.state === "started") return null;
      else if (monetization.state === "pending") return LoadingCardOverlay();
    } else {
      return null;
    }
  };
  const getCardState = () => {
    if (projectExclusive) {
      if (!monetization.state) return true;
      else if (monetization.state === "stopped") return true;
      else if (monetization.state === "started") return false;
      else if (monetization.state === "pending") return true;
    } else {
      return false;
    }
  };

  const checkLikeStatus = () => {
    return (
      projectLikes?.length > 0 &&
      projectLikes?.find((like) => like === user?.result?._id)
    );
  };

  const openProjectPage = (e) => {
    if (!getCardState()) {
      history.push(`/projects/${projectId}`);
    }
  };

  const openUserProfile = (e) => {
    if (!getCardState()) {
      history.push(`/profile/${userId}`);
    }
  };

  return (
    <li className="card">
      <div className="card__thumbnail" onClick={(e) => openProjectPage(e)}>
        {getCardOverlay()}
        <Thumbnail
          projectId={projectId}
          projectLogo={projectLogo}
          projectImage={projectImage}
          projectTagline={projectTagline}
        />
      </div>
      <div className="card__details">
        <div className="card__information flex flex-row items-center">
          <img
            className="information__user-img"
            src={projectLogo}
            alt="temp2"
          ></img>
          <div className="information__wrapper flex flex-col justify-center">
            <button
              className="information__project-title button-reset"
              onClick={(e) => openProjectPage(e)}
            >
              <h1>{projectTitle}</h1>
            </button>
            <button
              className="information__user-name button-reset"
              onClick={openUserProfile}
            >
              <h1>{userName}</h1>
            </button>
          </div>
        </div>
        <div className="card__statistics-container">
          <div className="statistics-container__wrapper">
            <button
              className="button-reset"
              onClick={() => {
                console.log("hi");
                if (user) {
                  dispatch(likeProject(projectId));
                } else {
                }
              }}
            >
              <Likes
                className={`statistics-container__svg ${
                  checkLikeStatus() ? "statistics-container__svg--liked" : ""
                } `}
              />
            </button>
            <span className="statistics-container__text">
              {projectLikes.length > 0 ? projectLikes.length : "-"}
            </span>
          </div>
          <div className="statistics-container__wrapper ">
            <Views className="statistics-container__svg" />
            <span className="statistics-container__text">
              {projectViews ? projectViews : "-"}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Card;
