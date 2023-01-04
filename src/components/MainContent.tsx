import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";

export interface IPaste {
    id: number;
    name: string;
    text: string;
}

const URL = "http://localhost:4001"

export default function DisplayPasteBin(){

    const [pasteList,setPasteList] = useState<IPaste[]>([])
    const [pasteSubmit,setPasteSubmit] = useState({
        name: "",
        text: ""
    })





const getPastesFromServer = async () => {
    try{
        const response = await axios.get(URL + "/pastes");

        setPasteList(response.data.rows);
  
    } catch (error){
        console.error(
            "you have an error"
        )
    }
   }

const postPasteToServer = async (newName: string, newText: string) => {
    try{
        await axios.post(URL + "/paste", {name:newName, text:newText} )
    } catch(error){
        console.log("error from post")
    }
}

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitted", pasteSubmit)
    postPasteToServer(pasteSubmit.name,pasteSubmit.text)

}

useEffect(() => {
    getPastesFromServer();

},[handleSubmit])

return (
<>
<div>
         <form onSubmit={handleSubmit}>

         <input
          placeholder="your name"
          type= "text"
          value={pasteSubmit.name}
              onChange={(e) => setPasteSubmit({...pasteSubmit, name: e.target.value})}
           />

          <input
          placeholder="paste here"
          type= "text"
          value={pasteSubmit.text}
              onChange={(e) => setPasteSubmit({...pasteSubmit, text: e.target.value})}
            />
      <input type="submit" />
        </form>
        </div>

    <div>
    {pasteList.map((paste) => {
        return (
            <div key={paste.id}>{paste.name} {paste.text}</div>
        )
    })}
</div>
</>
)
}