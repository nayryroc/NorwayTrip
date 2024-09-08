import {Link, useNavigate} from "react-router-dom";


function Light(){

    function updateLight(){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "homeassistant.local:8123/api/services/light/turn_on");
        xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0MzliNjBjMzNlYTc0MTkwYTRjM2QwNjI5Y2Y5M2VmOSIsImlhdCI6MTcyNTc5Njk0MiwiZXhwIjoyMDQxMTU2OTQyfQ.Vbw0E7LMsAfbsr_l-vSwMNUR72Mb_JOPtcrZ6V47Z-U")
      
        const body = JSON.stringify({
            entity_id:"light.status_light",
            brightness : 100,
            rgb_color : [255,0,255]
        });
    
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 201) {
            console.log(JSON.parse(xhr.responseText));
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
        xhr.send(body);
        
      }

    return (
        <div className="page">
            <button onClick={updateLight}>Click</button>
        </div>
    );
}

export default Light;