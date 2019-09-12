import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { StyledButton } from "../themes/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import Grid from "@material-ui/core/Grid";

import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {},

  coverFrame: {
    width: "890px",
    height: "310px",
    borderStyle: "transparent"
  },

  cameraIconCover: {
    position: "relative",
    bottom: "300px",
    color: "#f7ef0a"
  },
  coverPicture: {
    width: "900px",
    height: "290px",
    objectFit: "cover"
  },

  profilePicture: {
    width: "100%",
    height: "100%",
    maxWidth: "170px",
    maxHeight: "170px",
    objectFit: "cover",
    borderRadius: "50%",
    position: "relative",
    bottom: "160px",
    left: "14px",
    borderStyle: "solid",
    borderColor: "white"
  },

  iconAddProfile: {
    fontSize: "140px",
    position: "relative",
    left: "35px",
    bottom: "170px"
  },

  cameraIconProfile: {
    position: "relative",
    right: "170px",
    bottom: "190px",
    fontSize: "5px",
    color: "#f7ef0a"
  },

  name: {
    position: "relative",
    bottom: "120px",
    right: "160px",
    color: "#3b5998",
    fontSize: "25px",
    fontWeight: "bolder",
    fontStyle: "italic",
    fontFamily: "Times New Roman"
  },

  navButtons: {
    borderStyle: "solid",
    borderColor: "#dfe3ee",
    position: "relative",
    bottom: "210px",
    left: "26px"
  },

  button: {
    color: "#3b5998	",
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderColor: "red"
  },

  edit_addFriend: {
    position: "relative",
    bottom: "230px",
    fontSize: "14px",
    padding: "10px",
    width: "140px",
    height: "40px",
    left: "300px",
    backgroundColor: "#dfe3ee",
    color: "black"
  },

  userEdit: {
    position: "relative",
    bottom: "2px",
    marginRight: "10px"
  }
}));

const Banner = props => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [receivedMessages, setReceivedMessages] = useState("");
  const [sentMessages, setSentMessages] = useState("");
  const [city, setCity] = useState("");
  const [hometown, setHometown] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [profileUrl, setProfileUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [addFriendText, setAddFriendText] = useState("Add friend");
  const { profileID, photos, loggedInUser } = props;
  const userID = window.localStorage.getItem("userID");
  const friends = window.localStorage.getItem("friends");

  const bannerPic = coverUrl
    ? coverUrl
    : "https://textbook-bucket.s3.ca-central-1.amazonaws.com/1568136274004";

  useEffect(() => {
    axios
      .get(`/api/users/${profileID}`)
      .then(response => {
        console.log("user received in Banner:", response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setEmail(response.data.email);
        setCity(response.data.city);
        setHometown(response.data.hometown);
        setFriendsList(response.data.friends);
        setProfileUrl(response.data.profileUrl);
        setCoverUrl(response.data.coverUrl);
        setReceivedMessages(response.data.receivedMessages);
        setSentMessages(response.data.sentMessages);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const uploadProfile = async e => {
    const data = new FormData();
    data.append("image", e.target.files[0], e.target.files[0].name);
    await axios
      .put(`/api/users/${profileID}/avatar`, data)
      .then(response => {
        console.log("Uploaded profile picture", response.data.profileUrl);
        setProfileUrl(response.data.profileUrl);
        window.localStorage.setItem("userAvatar", response.data.profileUrl);
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const uploadCover = async e => {
    const data = new FormData();
    data.append("image", e.target.files[0], e.target.files[0].name);
    await axios
      .put(`/api/users/${profileID}/cover`, data)
      .then(response => {
        console.log("Uploaded cover picture", response.data.imageUrl);
        setCoverUrl(response.data.imageUrl);
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleAddFriend = async () => {
    await axios
      .post(`/api/users/${userID}/friends/${profileID}`)
      .then(response => {
        console.log("request to add friend: ", response.data);
        setAddFriendText("Friend added! ");
      })
      .catch(error => {
        console.log("unable to add friend! ", error);
      });
  };

  const isNewFriend = () => {
    for (let i = 0; i < friends.length; i++) {
      if (friends[i] == profileID) {
        return false;
      }

      console.log("friend number: ", friends[i]);
    }

    return true;
  };

  const displayAddFriend = () => {
    const newFriend = isNewFriend();
    if (newFriend) {
      return (
        <StyledButton
          variant="contained"
          className={classes.edit_addFriend}
          onClick={handleAddFriend}
        >
          <FontAwesomeIcon icon={faUserEdit} className={classes.userEdit} />
          {addFriendText}
        </StyledButton>
      );
    } else {
      return <span> </span>;
    }
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item id="coverPicture">
        <div className={classes.coverFrame}>
          <img
            src={bannerPic}
            className={classes.coverPicture}
            alt="Cover pic"
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="cover-upload"
            type="file"
            onChange={uploadCover}
          />
          {loggedInUser && (
            <label htmlFor="cover-upload">
              <IconButton component="span" className={classes.cameraIconCover}>
                <PhotoCamera />
              </IconButton>
            </label>
          )}
        </div>
        {profileUrl ? (
          <img
            src={profileUrl}
            className={classes.profilePicture}
            alt="Profile pic"
          />
        ) : (
          <FontAwesomeIcon
            icon={faUserCircle}
            className={classes.iconAddProfile}
          />
        )}
        <span className={classes.name}>
          {firstName}
          {"  "}
          {lastName}
        </span>{" "}
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="picture-upload"
          type="file"
          onChange={uploadProfile}
        />
        {loggedInUser && (
          <label htmlFor="picture-upload">
            <IconButton component="span" className={classes.cameraIconProfile}>
              <PhotoCamera />
            </IconButton>
          </label>
        )}
        {loggedInUser ? (
          <Link
            to={{
              pathname: `/profile/${profileID}/edit`,

              state: {
                firstName,
                lastName,
                email,
                city,
                hometown
              }
            }}
            style={{ textDecoration: "none" }}
          >
            <StyledButton
              variant="contained"
              className={classes.edit_addFriend}
            >
              <FontAwesomeIcon icon={faUserEdit} className={classes.userEdit} />
              Edit profile
            </StyledButton>
          </Link>
        ) : (
          displayAddFriend()
        )}
      </Grid>

      <Grid item>
        <div className={classes.navButtons}>
          <Link
            to={{
              pathname: `/profile/${profileID}/about`,

              state: {
                photos,
                firstName,
                lastName,
                email,
                city,
                hometown,
                loggedInUser
              }
            }}
            style={{ textDecoration: "none" }}
          >
            <StyledButton
              variant="contained"
              className={classes.button}
              type="submit"
            >
              About
            </StyledButton>
          </Link>
          <Link
            to={{
              pathname: `/profile/${profileID}/friendslist`,
              state: {
                friendsList
              }
            }}
            style={{ textDecoration: "none" }}
          >
            <StyledButton
              variant="contained"
              className={classes.button}
              type="submit"
            >
              Friends{" "}
            </StyledButton>
          </Link>
          <Link
            to={{
              pathname: `/profile/${profileID}/photos`,
              state: {
                photos,
                firstName
              }
            }}
            style={{ textDecoration: "none" }}
          >
            <StyledButton
              variant="contained"
              className={classes.button}
              type="submit"
            >
              Photos{" "}
            </StyledButton>
          </Link>
          {loggedInUser ? (
            <Link
              to={{
                pathname: `/profile/${profileID}/messages`,
                state: { receivedMessages, sentMessages, friends }
              }}
              style={{ textDecoration: "none" }}
            >
              <StyledButton
                variant="contained"
                className={classes.button}
                type="submit"
              >
                Messages{" "}
              </StyledButton>
            </Link>
          ) : (
            <Link
              to={{
                pathname: `/profile/${userID}/sendMessage/${profileID}`
              }}
              style={{ textDecoration: "none" }}
            >
              <StyledButton
                variant="contained"
                className={classes.button}
                type="submit"
              >
                Send a message{" "}
              </StyledButton>
            </Link>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default Banner;
