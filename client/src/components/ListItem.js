import { useState } from 'react';
import Modal from './Modal';
import ProgressBar from './ProgressBar';
import TickIcon from './TickIcon';
import tickIcon2 from '../imgs/tickicon.svg';


const ListItem = ({ task, getData }) => {

  const [showModal, setShowModal] = useState(false);

  return (
    <li className="list-item">

      <div className="info-container">
        <img src={tickIcon2} />
        <p className="task-title">{task.title}</p>
        <ProgressBar />
      </div>

      <div className='button-container'>
        <button className='edit' onClick={()=> setShowModal(true)}>Edit</button>
        <button className='delete'>Delete</button>
      </div>

      {showModal && 
        <Modal mode={'edit'} setShowModal={setShowModal} task={task} getData={getData} />
      }

    </li>
  );
}

export default ListItem;
