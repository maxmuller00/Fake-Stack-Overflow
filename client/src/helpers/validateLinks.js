const validateLinks = (link) => {
  let allLinks = link.match(/\[[^\]]*\]\([^)]*\)/g) ?? [];
    let validLinks = link.match(/\[[^\]]*\]\((https?:\/\/[^)]*)\)/g) ?? [];
    let foundError = (allLinks.length !== validLinks.length) ? true : false;
    return foundError;
  } 
export default validateLinks;
