import { useEffect, useState } from 'react';
import Auth from './components/Auth';
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { useCookies } from "react-cookie";

const App = () => {

  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json.todos);


    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, [])


  //sort by date
  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))


  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <>
          <ListHeader listName={'🏊🏼‍♂️ Holiday Tick List'} getData={getData} />
          <p className='user-email'>Bem vindo de volta {userEmail}</p>
          {sortedTasks &&
            sortedTasks.map((task) => <ListItem key={task.id} task={task} getData={getData} />)
          }
        </>
      }

    </div>
  );
}

export default App;
