function formatQuestionMetadata(postedDate) {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[postedDate.getMonth()];
  const day = String(postedDate.getDate()).padStart(2, '0');
  const year = postedDate.getFullYear();
  const hours = String(postedDate.getHours()).padStart(2, '0');
  const minutes = String(postedDate.getMinutes()).padStart(2, '0');
  
  const currentDate = new Date();
  const timeDifference = currentDate - postedDate; // Calculate the time difference in milliseconds

  const secondsInMs = 1000;
  const minutesInMs = 60 * secondsInMs;
  const hoursInMs = 60 * minutesInMs;
  const daysInMs = 24 * hoursInMs;
  const yearsInMs = 365 * daysInMs;

  if (timeDifference < minutesInMs) {
    // Posted less than a minute ago
    const secondsAgo = Math.floor(timeDifference / secondsInMs);
    let a = " seconds ago "
    return secondsAgo + a;
  } else if (timeDifference < hoursInMs) {
    // Posted less than an hour ago
    const minutesAgo = Math.floor(timeDifference / minutesInMs);
    let a = " minutes ago "
    return minutesAgo+ a;
  } else if (timeDifference < daysInMs) {
    // Posted less than a day ago
    const hoursAgo = Math.floor(timeDifference / hoursInMs);
    let a = " hours ago "
    
    return hoursAgo+a;
  } else if (timeDifference < yearsInMs) {
    // Posted less than a year ago
    return " on "+month+" "+day +" at "+ hours+":"+minutes;
  } else {
    // Posted more than a year ago
    
    return " on "+month+" "+day+" "+year +" at "+ hours+":"+minutes;
  }
} export default formatQuestionMetadata;
