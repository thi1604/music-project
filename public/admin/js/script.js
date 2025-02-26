// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      // console.log(URL.createObjectURL(file));
    }
  });
}
// End Upload Image

//Show alert
const hidden = document.querySelector("[show-alert]");
if(hidden){
  // console.log(hidden);
  let time = hidden.getAttribute("show-alert") || 3000;
  time = parseInt(time);
  setTimeout(()=>{
    hidden.classList.add("hidden");
  }, time);
}

// Upload Audio
const uploadAudio = document.querySelector("[upload-audio]");
if(uploadAudio) {
  const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
  const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
  const source = uploadAudioPlay.querySelector("source");
  uploadAudioInput.addEventListener("change", () => {
    const file = uploadAudioInput.files[0];
    if(file) {
      source.src = URL.createObjectURL(file);
      uploadAudioPlay.load(); // Chu y load lai moi nge duoc
    }
  });
}
// End Upload Audio


// Change Status Item

const listButton = document.querySelectorAll("[button-change-status]");

if(listButton.length > 0){
  listButton.forEach((item) => {
    item.addEventListener("click", () => {
      const link = item.getAttribute("link");
      //Call api voi phuong thuc la patch
      fetch(link, {
        method : "PATCH",
        headers: {
          "Content-Type": "application/json",
        }
      })
        // Tra ve cho FE data dang json, roi dich json thanh js
        .then(res => res.json())
        //Dich xong tra gia tri cho data, neu thanh cong reload lai trang
        .then(data => {
          if(data.code == 200){
            window.location.reload();
          }
        });
    });
  });
}


const listPagination = document.querySelectorAll("[num-page]"); 
// console.log(listPagination);

if(listPagination.length > 0){
  //Check xem gia tri page ma lon hon tong so nut phan trang, neu co
  // phai xoa gia tri page tren link va reload page
  let url = new URL(window.location.href);
  let numPageOnUrl = parseInt(url.searchParams.get("page"));
  let maxPage = listPagination[listPagination.length - 1];
  maxPage = parseInt(maxPage.getAttribute("num-page"));
  
  if(numPageOnUrl > maxPage){
    url.searchParams.delete("page");
    window.location.href = url.href;
  }
  //Bat su kien cho cac nut
  listPagination.forEach( (item) => {
    item.addEventListener("click", () => {
      const pageNumCurrent = item.getAttribute("num-page");
      if(pageNumCurrent && pageNumCurrent != "1"){
        url.searchParams.set("page", pageNumCurrent);
      }
      else
        url.searchParams.delete("page");
      window.location.href = url.href;
    });
  });
  let currPage = url.searchParams.get("page") || "";
  if(currPage == "") currPage = "1";
  const currButton = document.querySelector(`[num-page="${currPage}"]`);
  currButton.classList.add("active");
}

//End pagination
