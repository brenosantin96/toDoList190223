import { useEffect, useState } from 'react';
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";

const App = () => {
  const userEmail = "breno@gmail.com"
  const [tasks, setTasks] = useState([]);



  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json.todos);


    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, [])
  
  console.log(tasks);

  //sort by date
  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))


  return (
    <div className="app">
      <ListHeader listName={'🏊🏼‍♂️ Holiday Tick List'} getData={getData} />
      {sortedTasks && 
        sortedTasks.map((task) => <ListItem key={task.id} task={task} getData={getData} />)
      }
    </div>
  );
}

export default App;
