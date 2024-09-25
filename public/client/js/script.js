// APlayer
const aplayer = document.getElementById('aplayer');
if(aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);
  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);
  const ap = new APlayer({
    container: aplayer,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar
      }
    ],
    autoplay: true
  });
  const avatar = document.querySelector(".singer-detail .inner-avatar");
  const avatar2 = document.querySelector(".aplayer .aplayer-pic");
  ap.on('play', function () {
    avatar.style.animationPlayState = "running";
    avatar2.style.animationPlayState = "running";
  });
  ap.on('pause', function () {
    avatar.style.animationPlayState = "paused";
    avatar2.style.animationPlayState = "paused";
  });
}
// End APlayer

// buttonLike
const buttonLike = document.querySelector("[button-like]");
if(buttonLike){
  buttonLike.addEventListener("click", () => {
    const status = buttonLike.classList.contains("like");
    const data = {
      id: buttonLike.getAttribute("button-like")
    };
    if(status){
      data.type = "dislike";
      buttonLike.classList.remove("like");
    }
    else{
      data.type = "like";
      buttonLike.classList.add("like");
    }
    fetch("/songs/like", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res=> res.json())
    .then(dataReturn => {
      if(dataReturn.code == 200){
        const innerLike = buttonLike.querySelector(".inner-number");
        innerLike.innerHTML = dataReturn.updateLike;
      }
    })
  });
}
// End buttonLike
const buttonLove = document.querySelector("[button-love]");
if(buttonLove){
  buttonLove.addEventListener("click", ()=> {
    const data = {
      id: buttonLove.getAttribute("button-love")
    };
    fetch("/songs/love", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      if(data.status == "love"){
        buttonLove.classList.add("love-song");
      }
      else{
        buttonLove.classList.remove("love-song");
      }
    })
  });
}
// buttonLove