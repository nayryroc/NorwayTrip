import './App.css';
import Header from "./header/Header";
import Feed from "./feed/Feed";
import About from './about/About';
import Next from './next/Next';
import UpdatesCTA from './updates-cta/UpdatesCTA';
import SupportCTA from './supportCTA/SupportCTA';
import Footer from './footer/Footer';
import bg from './images/mountains.jpg';


function App() {
  return (
    <div className="page">
        <Header subpage={false} title="YWAM Ålesund" bg={bg} filter={false}/>
        <About/>
        <UpdatesCTA/>
        <Next/>
        <SupportCTA size={"sm"}/>
        <Footer alt={false}/>
    </div>
  );
}

export default App;
