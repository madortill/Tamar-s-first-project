showOrder(0);

const showOrder = (i) => {
    console.log(i)
    setTimeout(() => {
        document.getElementById(`option-${i}`).classList.add("blink-animation");
    if (i < (userArr.length)) {
            showOrder(i+1);
       }
    }, 1000);
}   