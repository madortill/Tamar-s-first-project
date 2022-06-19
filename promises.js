function delay(ms) {
    return(new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    }));
  }
  
  delay(3000).then(() => alert('runs after 3 seconds'));


  showCircle(150, 150, 100).then(div => {
    div.classList.add('message-ball');
    div.append("Hello, world!");
  });