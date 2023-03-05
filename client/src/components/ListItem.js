import { useEffect, useState } from 'react';
import Modal from './Modal';
import ProgressBar from './ProgressBar';
import TickIcon from './TickIcon';
import tickIcon2 from './icons8-checkmark.svg';


const ListItem = ({ task, getData }) => {

  const [showModal, setShowModal] = useState(false);


  const deleteItem = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
        method: 'DELETE'
      });
      
      if (response.status === 200) { 
        console.log('chegou aq')
        getData();
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <li className="list-item">

      <div className="info-container">
        <img src={tickIcon2} className="tick" height='50px' width='50px' />
        <p className="task-title">{task.title}</p>
        <ProgressBar progress={task.progress} />
      </div>

      <div className='button-container'>
        <button className='edit' onClick={() => setShowModal(true)}>Edit</button>
        <button className='delete' onClick={deleteItem}>Delete</button>
      </div>

      {showModal &&
        <Modal mode={'edit'} setShowModal={setShowModal} task={task} getData={getData} />
      }

    </li>
  );
}

export default ListItem;
