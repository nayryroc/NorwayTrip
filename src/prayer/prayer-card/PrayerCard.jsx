import './PrayerCard.css';


function PrayerCard({name, date, text, canDelete, id, deleteReq}){

    return (
        <div className='prayer-card'>
            <div className="prayer-card__wrapper">
                <p className="title title_sm prayer-card__title">{name}</p>
                <p className="text prayer-card__date">{date}</p>
            </div>
            <div className="prayer-card__divider"></div>
            
            {(!canDelete) ?
                <p className="text">{text}</p>
                
                :
                <div className="prayer-card__delete-wrapper">
                    <p className="prayer-card__content text">{text}</p>
                    <button className='button' onClick={()=>{deleteReq(id)}}>Delete</button>
                </div>
            }

        </div>
    );
}

export default PrayerCard;