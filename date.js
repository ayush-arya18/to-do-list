exports.getdate=getdate();
exports.getday=getday();
function getdate(){
    const today=new Date();
    const options={
        weekday: "long",
        month: "long",
        day: "numeric"
    }
    return today.toLocaleDateString("en-US",options);
}
function getday(){
    const today=new Date();
    const options={
        weekday:  "long"
    }
    return today.toLocaleDateString("en-US",options);
}