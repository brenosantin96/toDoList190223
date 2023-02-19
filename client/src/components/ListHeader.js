import { useState } from "react";
import Modal from "./Modal";

const ListHeader = ({ listName, getData }) => {

    const [showModal, setShowModal] = useState(false);

    const signOut = () => {
        console.log("signout");
    }


    return (
        <div className="list-header">
            <h1>{listName}</h1>
            <div className="button-container">
                <button className="create" onClick={() => { setShowModal(true) }}>ADD NEW</button>
                <button className="signout" onClick={signOut}>SIGN OUT</button>
            </div>

            {showModal &&
                <Modal mode={'create'} setShowModal={setShowModal} getData={getData} />
            }
        </div>
    );
}

export default ListHeader;
