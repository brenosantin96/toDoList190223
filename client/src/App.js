import { useEffect, useState } from 'react';
import Auth from './components/Auth';
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";

const App = () => {
  const userEmail = "breno@gmail.com"
  const [tasks, setTasks] = useState([]);

  const authToken = false;

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

  console.log(tasks);

  //sort by date
  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))


  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <>
          <ListHeader listName={'🏊🏼‍♂️ Holiday Tick List'} getData={getData} />
          {sortedTasks &&
            sortedTasks.map((task) => <ListItem key={task.id} task={task} getData={getData} />)
          }
        </>
      }

    </div>
  );
}

export default App;
