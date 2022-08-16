import './App.css';
import Header from "./header/Header";
import Feed from "./feed/Feed";


function App() {
  return (
    <div className="App">
        <Header subpage={false}/>
        <Feed/>
    </div>
  );
}

export default App;
