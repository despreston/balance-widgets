module.exports = lastUpdated => {
  const dayMilliseconds = 24*60*60*1000;
  const today = new Date();
  const daysSinceUpdate = Math.round(
    Math.abs((lastUpdated.getTime() - today)) / dayMilliseconds
  );

  switch (true) {
    case (daysSinceUpdate < 2)   : return 'green';
    case (daysSinceUpdate <= 7)  : return 'yellow';
    case (daysSinceUpdate <= 14) : return 'orange';
    default                      : return 'red';
  }
}