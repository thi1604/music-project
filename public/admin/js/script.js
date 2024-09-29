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