import { useEffect, useState} from "react";
import axios from "axios";

//--------------------------------------------------------------------------------
//Defining types and URL for basic understanding when importing data/doing requests
//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------Defining interface for pastes
export interface IPaste {
  id: number;
  name: string;
  text: string;
}

//--------------------------------------------------------------------------------Settting URL for render.com back-end
const URL = "https://pastebin-server.onrender.com";

//--------------------------------------------------------------------------------
//Start of our function, aims to have a user retrieve and add to a list of name, text pairs
//--------------------------------------------------------------------------------

export default function DisplayPasteBin():JSX.Element {

//--------------------------------------------------------------------------------Defining useStates
  const [pasteList, setPasteList] = useState<IPaste[]>([]);
  const [pasteSubmit, setPasteSubmit] = useState({
    name: "",
    text: "",
  });

//--------------------------------------------------------------------------------Fetches all data from server
  const getPastesFromServer = async () => {
    try {
      const response = await axios.get(URL + "/pastes");

      setPasteList(response.data.rows);
    } catch (error) {
      console.error("you have an error");
    }
  };


//--------------------------------------------------------------------------------Posts new data to server
  const postPasteToServer = async (newName: string, newText: string) => {
    try {
      await axios.post(URL + "/paste", { name: newName, text: newText });
    } catch (error) {
      console.log("error from post");
    }
  };

//--------------------------------------------------------------------------------Actions to perform when form is submitted
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  //  console.log("submitted", pasteSubmit);
    postPasteToServer(pasteSubmit.name, pasteSubmit.text);
    getPastesFromServer();
  };


//--------------------------------------------------------------------------------UseEffect loading data on first render (empty dependency)
  useEffect(() => {
    getPastesFromServer();
  }, []);

//--------------------------------------------------------------------------------
//Return statement - Gives form and and list of data from server to HTML
//--------------------------------------------------------------------------------

  return (
    <>
      <div>
{/*-------------------------------------------------------------------------------Describes behaviour of the form to enter data */}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="your name"
            type="text"
            value={pasteSubmit.name}
            onChange={(e) =>
              setPasteSubmit({ ...pasteSubmit, name: e.target.value })
            }
          />

          <input
            placeholder="paste here"
            type="text"
            value={pasteSubmit.text}
            onChange={(e) =>
              setPasteSubmit({ ...pasteSubmit, text: e.target.value })
            }
          />
          <input type="submit" />
        </form>
      </div>


{/*-------------------------------------------------------------------------------Maps over the retrieved list of all pastes from updated table */}
      <div>
        {pasteList.map((paste) => {
          return (
            <div key={paste.id}>
              {paste.name} {paste.text}
            </div>
          );
        })}
      </div>
    </>
  );
}
