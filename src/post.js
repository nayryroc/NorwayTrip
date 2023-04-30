class Post {

    constructor(title, description, image_path, post_body, post_type, date, timestamp, views) {
        this.title = title;
        this.description = description;
        this.image_path = image_path;
        this.post_body = post_body;
        this.post_type = post_type;
        this.id = null;
        this.date = date;
        this.timestamp = timestamp;
        this.views = views;
    }

    getTitle(){
        return this.title;
    }

    getDescription(){
        return this.description;
    }

    getImagePath(){
        return this.image_path;
    }

    getId(){
        return this.id;
    }

    getPostBody(){
        return this.post_body;
    }

    getPostType(){
        return this.post_type;
    }

    getDate(){
        return this.date;
    }

    getViews(){
        return this.views;
    }

    setTitle(title){
        this.title = title;
    }

    setDescription(desc){
        this.description = desc;
    }

    setImagePath(path){
        this.image_path = path;
    }

    setPostBody(body){
        this.post_body = body;
    }

    setPostType(type){
        this.post_type = type;
    }

    setId(id){
        this.id = id;
    }

    setDate(date){
        this.date = date;
    }
}

export var postConverter = {
    toFirestore: function(post) {
        return {
            title: post.title,
            description: post.description,
            image_path: post.image_path,
            post_body: post.post_body,
            post_type: post.post_type,
            date: post.date,
            timestamp: post.timestamp,
            views: post.views
        };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new Post(data.title, data.description, data.image_path, data.post_body, data.post_type, data.date, data.timestamp, data.views);
    }
};

export default Post;