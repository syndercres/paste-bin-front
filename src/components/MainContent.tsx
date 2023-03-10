import { useEffect, useState } from "react";
import axios from "axios";
import "./MainContent.css";

//--------------------------------------------------------------------------------
//Defining types and URL for basic understanding when importing data/doing requests
//--------------------------------------------------------------------------------

//--------------------------------------------------------------------------------Defining interface for pastes
export interface IPaste {
  id: number;
  name: string;
  text: string;
}

//--------------------------------------------------------------------------------Defining interface for comments
export interface IComment {
  comment_id: number;
  paste_id: number;
  name: string;
  comment: string;
}
//--------------------------------------------------------------------------------Function that limits text length

function limitText(text: string): string {
  let newText = "";

  if (text.length > 60) {
    newText = text.substring(0, 59);
  } else {
    newText = text;
  }

  return newText;
}

//--------------------------------------------------------------------------------Settting URL for render.com back-end
const URL = "https://pastebin-server.onrender.com";

//--------------------------------------------------------------------------------
//Start of our function, aims to have a user retrieve and add to a list of name, text pairs
//--------------------------------------------------------------------------------

export default function DisplayPasteBin(): JSX.Element {
  //--------------------------------------------------------------------------------Defining useStates
  const [pasteList, setPasteList] = useState<IPaste[]>([]);
  const [pasteSubmit, setPasteSubmit] = useState({
    name: "",
    text: "",
  });
  const [fullText, setFullText] = useState<string>("");

  const [commentList, setCommentList] = useState<IComment[]>([]);

  const [filteredComments, setFilteredComments] = useState<IComment[]>([]);

  const [commentSubmit, setCommentSubmit] = useState({
    name: "",
    comment: "",
  });

  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null);

  //--------------------------------------------------------------------------------Fetches all data from server
  const getPastesFromServer = async () => {
    //   console.log("fetching list from api")
    try {
      const response = await axios.get(URL + "/pastes");

      setPasteList(response.data.rows);
    } catch (error) {
      console.error("you have an error with pastes");
    }
  };

  const getCommentsFromServer = async () => {
    //   console.log("fetching list from api")
    try {
      const response = await axios.get(URL + "/comments");
      setCommentList(response.data.rows);
    } catch (error) {
      console.error("you have an error with comments");
    }
  };

  //--------------------------------------------------------------------------------Posts new paste to server
  const postPasteToServer = async (newName: string, newText: string) => {
    if (newText.length > 0) {
      try {
        await axios.post(URL + "/paste", { name: newName, text: newText });
      } catch (error) {
        console.log("error from post");
      }
    } else {
      alert("you must paste something before you submit!");
    }
  };

  //--------------------------------------------------------------------------------Posts new comment attached to paste to server
  const postCommentToServer = async (
    pasteId: number,
    newName: string,
    newComment: string
  ) => {
    if (newComment.length > 0) {
      try {
        await axios.post(URL + "/comment", {
          paste_id: pasteId,
          name: newName,
          comment: newComment,
        });
      } catch (error) {
        console.log("error from post");
      }
    } else {
      alert("you must paste something before you submit!");
    }
  };

  //--------------------------------------------------------------------------------Deletes all data from server

  const deleteAllPastes = async () => {
    if (window.confirm("You sure? No going back...") === true) {
      try {
        await axios.delete(URL + "/delete");
      } catch (error) {
        console.error(error);
      }
    }
  };

  //--------------------------------------------------------------------------------Actions to perform when paste form is submitted
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //  console.log("submitted", pasteSubmit);
    postPasteToServer(pasteSubmit.name, pasteSubmit.text);
    getPastesFromServer();
  };

  //--------------------------------------------------------------------------------Actions to perform when comment form is submitted

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //  console.log("submitted", pasteSubmit);

    if (clickedButtonId === null) {
      console.log("no id");
      return;
    } //makes no changes if null
    postCommentToServer(
      clickedButtonId,
      commentSubmit.name,
      commentSubmit.comment
    );
    getCommentsFromServer();
  };

  //--------------------------------------------------------------------------------UseEffect loading data on first render (empty dependency)
  useEffect(() => {
    getPastesFromServer();
  }, [pasteList]);

  useEffect(() => {
    setFilteredComments(
      commentList.filter((comment) => {
        return comment.paste_id === clickedButtonId;
      })
    );
    getCommentsFromServer();
  }, [clickedButtonId, commentList]);

  //--------------------------------------------------------------------------------handler function for clicking on a summarised paste

  const handlePasteClick = async (text: string, id: number) => {
    setClickedButtonId(id);
    setFullText(text);
    getCommentsFromServer();
    // console.log(clickedButtonId);
    // console.table(filteredComments);
  };
  //--------------------------------------------------------------------------------
  //Return statement - Gives form and and list of data from server to HTML
  //--------------------------------------------------------------------------------

  return (
    <>
      <h1>Josiah and Sinbad's Pastebin</h1>
      <div className="great-container">
        <div className="text-exclude">
          <div className="inputForm">
            {/*-------------------------------------------------------------------------------Describes behaviour of the form to enter data */}
            <h2>Submit a Paste</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="file"
                placeholder="your name"
                type="text"
                value={pasteSubmit.name}
                onChange={(e) =>
                  setPasteSubmit({ ...pasteSubmit, name: e.target.value })
                }
              />

              <textarea
                className="file"
                placeholder="paste here"
                value={pasteSubmit.text}
                onChange={(e) =>
                  setPasteSubmit({ ...pasteSubmit, text: e.target.value })
                }
              />
              <input className="file" type="submit" />
            </form>
          </div>

          {/*-------------------------------------------------------------------------------Maps over the retrieved list of all pastes from updated table */}
          <div className="list-container">
            {pasteList.map((paste) => {
              return (
                <div className="list-item" key={paste.id}>
                  <button
                    onClick={() => {
                      handlePasteClick(paste.text, paste.id);
                    }}
                  >
                    {paste.name}: {limitText(paste.text)}
                  </button>
                </div>
              );
            })}
          </div>

          {/*------------------------------------------------------------------------------Button to delete all entries */}
          <button
            className="delete"
            onClick={() => {
              deleteAllPastes();
              getPastesFromServer();
            }}
          >
            Delete all pastes
          </button>
        </div>
        <div className="text-box">
          <h2>Full Paste:</h2>

          {clickedButtonId !== null ? (
            <p>{fullText}</p>
          ) : (
            "Click to view full paste text."
          )}
          <br />
          <h2>Comments:</h2>

          {clickedButtonId !== null ? (
            <div className="commentForm">
              {/*-------------------------------------------------------------------------------Describes behaviour of the form to enter comment */}
              <form onSubmit={handleCommentSubmit}>
                <input
                  placeholder="your name"
                  type="text"
                  value={commentSubmit.name}
                  onChange={(e) =>
                    setCommentSubmit({ ...commentSubmit, name: e.target.value })
                  }
                />

                <input
                  placeholder="comment here"
                  type="text"
                  value={commentSubmit.comment}
                  onChange={(e) =>
                    setCommentSubmit({
                      ...commentSubmit,
                      comment: e.target.value,
                    })
                  }
                />
                <input type="submit" />
              </form>
            </div>
          ) : (
            "Click to view comments."
          )}

          <div className="comments-container">
            {filteredComments.map((comment) => {
              return (
                <div className="list-item" key={comment.comment_id}>
                  <p>
                    {comment.name}: {comment.comment}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
