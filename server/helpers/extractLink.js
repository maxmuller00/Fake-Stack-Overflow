function extractLink(text) {
  const regex = /\[(.*?)\]\((.*?)\)/g;
  let startPoint = 0;
  let endPoint = 0;
  let match = [];
  let result = [];
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    endPoint = match.index;
    result.push(
      text.slice(startPoint, endPoint),
      <a href={match[2]} key={i} target="_blank" rel="noreferrer">
        {match[1]}
      </a>
    );
    startPoint = regex.lastIndex;
    i++;
  }
  //console.log("Text from extractLink is: "+text);
  result.push(text.slice(startPoint));
  return <>{result}</>;
}

export default extractLink;
