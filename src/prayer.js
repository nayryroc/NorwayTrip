class PrayerReq {

    constructor(name, date, isPrivate, text, id) {
        this.name = name;
        this.date = date;
        this.isPrivate = isPrivate;
        this.text = text;
        this.id = null;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getDate(){
        return this.date.toDate().toDateString();
    }

    getIsPrivate(){
        return this.isPrivate;
    }

    getText(){
        return this.text;
    }

    setId(id){
        this.id = id;
    }

    setName(name){
        this.name = name;
    }

    setDate(date){
        this.date = date;
    }

    setIsPrivate(val){
        this.isPrivate = val;
    }

    setText(text){
        this.text = text;
    }

}

export var prayerConverter = {
    toFirestore: function(prayer) {
        return {
            name: prayer.name,
            date: prayer.date,
            isPrivate: prayer.isPrivate,
            text: prayer.text,
        };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new PrayerReq(data.name, data.date, data.isPrivate, data.text);
    }
};

export default PrayerReq;