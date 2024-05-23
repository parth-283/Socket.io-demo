import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { cyan, deepPurple, indigo, red, teal } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import {
  Box,
  Chip,
  Grid,
  Input,
  Paper,
  Button,
  TextField,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "5rem 0",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [inputRoomCode, setInputRoomCode] = useState("");
  const [userName, setUserName] = useState("");
  const [inRoom, setInRoom] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    console.log(messages, "messages");
    socket.on("chat message", (msg) => {
      console.log(msg, "msg>>>>>");
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
    });

    socket.on("server message", (msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { name: "Server", message: msg },
      ]);
      scrollToBottom();
    });

    return () => {
      socket.off("chat message");
      socket.off("server message");
    };
  }, []);

  const createRoom = async () => {
    socket.emit("create room", userName, (response) => {
      setRoomCode(response.code);
      setUserName(response.name);
      setInRoom(true);
    });
  };

  const deleteRoom = () => {
    socket.emit("delete room", roomCode, (response) => {
      setMessages([]);
      setInRoom(false);
      handleClose();
    });
  };

  const joinRoom = () => {
    socket.emit("join room", inputRoomCode, userName, (response) => {
      if (response.success) {
        setRoomCode(inputRoomCode);
        setInRoom(true);
      } else {
        alert(response.message);
      }
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message && roomCode) {
      socket.emit("chat message", roomCode, message, userName);
      setMessage("");
    }
  };

  const leaveRoom = (e) => {
    socket.emit("leave room", inputRoomCode, userName, (response) => {
      setRoomCode("");
      setInRoom(false);
      handleClose();
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };

  return (
    <>
      <Item>
        {!inRoom ? (
          <Card sx={{ maxWidth: 400 }}>
            <CardHeader title="Chat application" />
            <CardContent>
              <Box>
                <TextField
                  fullWidth
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter name"
                  sx={{ my: 1 }}
                />
                <TextField
                  fullWidth
                  value={inputRoomCode}
                  onChange={(e) => setInputRoomCode(e.target.value)}
                  placeholder="Enter room code"
                  sx={{ my: 1 }}
                />
              </Box>
              <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
                <Button
                  disabled={!userName}
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={createRoom}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Create Room
                </Button>

                <Button
                  disabled={!inputRoomCode || !userName}
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 1 }}
                  onClick={joinRoom}
                  startIcon={<ConnectWithoutContactIcon />}
                >
                  Join Room
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ maxWidth: 400 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: indigo[300] }} aria-label="recipe">
                  {userName?.at(0)}
                </Avatar>
              }
              action={
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
              }
              title={userName}
              subheader={`Room Code: ${roomCode}`}
            />
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  width: "20ch",
                },
              }}
            >
              <MenuItem
                key={"delete-room"}
                // selected={option === "Pyxis"}
                onClick={deleteRoom}
              >
                Delete room
              </MenuItem>
              <MenuItem
                key={"leave-room"}
                // selected={option === "Pyxis"}
                onClick={leaveRoom}
              >
                Leave room
              </MenuItem>
            </Menu>
            <CardContent
              sx={{
                pb: 5,
                border: "1px solid #00000012",
                height: "17rem",
                overflow: "auto",
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.name !== userName ? "flex-start" : "flex-end",
                    mb: 1,
                  }}
                >
                  <Chip
                    label={`${msg.name == userName ? "You" : msg.name}: ${
                      msg.message
                    }`}
                    sx={{
                      bgcolor:
                        msg.name == "Server"
                          ? cyan[200]
                          : msg.name !== userName
                          ? deepPurple[200]
                          : teal[200],
                    }}
                  />
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardActions disableSpacing>
              <Box
                component="form"
                onSubmit={sendMessage}
                sx={{ display: "flex", flex: 1, m: 2 }}
              >
                <Input
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                />
                <IconButton type="submit" aria-label="send" sx={{ ml: 1 }}>
                  <SendIcon />
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        )}
      </Item>
    </>
  );
}
