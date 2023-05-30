const DAYS = 1;

function isExpired(user){
    let d = new Date(user.metadata.lastSignInTime);
    return d.setDate(d.getDate() + DAYS) < new Date();
}

export default isExpired;