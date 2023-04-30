import './Contact.css';
import {Link, useNavigate} from "react-router-dom";
import Header from '../header/Header';
import Footer from '../footer/Footer';
import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import bg from '../images/fjord-bg.jpg';

function Contact(size){
    const form = useRef();
    const [sent, setSent] = useState(false);


    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_gdr5op4', 'template_g5mukg8', form.current, '-OsXW9T2hsMBd1HyS')
          .then((result) => {
              console.log(result.text);
              setSent(true);
          }, (error) => {
              console.log(error.text);
          });
      };


    return (
        <div className="page">

            <Header subpage={true} title={"Contact"} bg={bg} filter={true}/>

            <div className={"section"}>
                <div className="section__content">

                <p className="text text_lg contact-text">Want to get in touch with me? Send a message below and I will try to get back to you as soon as I can.</p>

                {((!sent) ?
                    <form className='contact-form' ref={form} onSubmit={sendEmail}>
                        <label className='form-label title title_sm' for={"email"}>Email</label>
                        <input required className='form-input text' type="email" name="reply_to" />
                        <label className='form-label title title_sm' for={"from_name"}>Name</label>
                        <input required className='form-input text' type="text" name="from_name" />
                        <label className='form-label title title_sm' for={"subject"}>Subject</label>
                        <input required className='form-input text' type="text" name="subject" />
                        <label className='form-label title title_sm' for={"message"}>Message</label>
                        <textarea rows={7} className='form-textarea text' name="message" />
                        <input className='button form-submit' type="submit" value="Send" />
                    </form>
                    :
                    <p className="text text_lg form-success">Message Sent</p>
                )}
                </div>
            </div>

            <Footer alt={true}/>

        </div>
        
    );
}

export default Contact;