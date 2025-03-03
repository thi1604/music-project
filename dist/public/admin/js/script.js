
// filter products

const listProducts = document.querySelectorAll("[button-status]");
let url = new URL(window.location.href);

listProducts.forEach((item)=>{
  item.addEventListener("click", ()=>{
    const status = item.getAttribute("button-status");
    url.searchParams.delete("page"); //Neu loc trang thai san pham, mac dinh show tu trang 1 
    if(status != ""){
      url.searchParams.set("status", status);
    }
    else{
      url.searchParams.delete("status");
    }
    window.location.href = url;
  });
});


//Choose checkbox for change status all item

const changeAll = document.querySelector(`input[change-status-all]`);
const listItem = document.querySelectorAll(`input[change-status-item]`);
if(changeAll){
  changeAll.addEventListener("click", ()=>{
    const check = changeAll.checked;
    listItem.forEach((item)=>{
      item.checked = check;
    });
  });
}

//Check all item. If true, changeAll has checked = true
const lengthAll = listItem.length;

listItem.forEach(item => {
  item.addEventListener("click", ()=> {
    const checkedListItem = document.querySelectorAll(`input[change-status-item]:checked`);
    if(lengthAll == checkedListItem.length){
      changeAll.checked = true;
    }
    else
      changeAll.checked = false;
  });
});

//End Choose checkbox for change status all item


//Change many Item from checkbox
const divActive = document.querySelector("div[change-many-items]");
if(divActive){
  const select = divActive.querySelector("select");
  const button = divActive.querySelector("button");
  // const checkedListItem = document.querySelectorAll(`input[change-status-item]:checked`);
  button.addEventListener("click", () => {
    const checkedListItem = document.querySelectorAll(`input[change-status-item]:checked`);
    const ids = [];
    if(select.value != "" && checkedListItem.length > 0){
      checkedListItem.forEach((item) => {
        ids.push(item.getAttribute("value"));
      });

      const dataChange = {
        ids : ids,
        status : select.value
      }
      console.log(dataChange);
      const link = divActive.getAttribute("link");
      fetch(link, {
        method : "PATCH",
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify(dataChange)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == 200)
            window.location.reload();
        })
    } 
    else
      alert("Chưa chọn sản phẩm và hành động!");
  });
}


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


// Phan quyen cho nhom quyen
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions){
  let rolesArray = [];
  const buttonUpdate = document.querySelector("button[button-submit]");
  buttonUpdate.addEventListener("click", ()=>{
    const listRoles = tablePermissions.querySelectorAll("th[role-id]");
    listRoles.forEach((item)=>{
      const roleAndPermissions = {
        id : item.getAttribute("role-id"),
        permissions: []
      };
      const roles = tablePermissions.querySelectorAll(`input[data-id="${roleAndPermissions.id}"]:checked`);
      roles.forEach((item)=>{
        const permission = item.getAttribute("data-name");
        roleAndPermissions.permissions.push(permission);
      });
      rolesArray.push(roleAndPermissions);
    });
    const path = buttonUpdate.getAttribute("button-submit");
    fetch(path,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        rolesArray: rolesArray
      })
    })
      .then(res=> res.json())
      .then(data=>{
      if(data.code == 200){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cập nhật thành công",
          showConfirmButton: false,
          timer: 1500
        });
      }
    })
  });
}
// End Phan quyen cho nhom quyen(Quan trong)


// Restore
const listButtonRestore = document.querySelectorAll("[restore-item]");
if(listButtonRestore.length > 0){
  listButtonRestore.forEach((item)=>{
    item.addEventListener("click", ()=>{
      const link = item.getAttribute("link-id-button-trash");
      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(res => res.json())
      .then(data => {
        if(data.code == 200){
          window.location.reload();
        }
      })
    });
  });
}
// End Restore


// Delete item
const listButtonDelete = document.querySelectorAll("[link-id-button]");
if(listButtonDelete.length > 0){
  listButtonDelete.forEach((item) => {
    item.addEventListener("click", async ()=> {
      const link = item.getAttribute("link-id-button");
      console.log(link);
      await fetch(link, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == 200)
            window.location.reload();
      })
    });
  });
}
// End Delete item

// Xoa vinh vien
const listButtonDeletePer = document.querySelectorAll("[permanently-deleted]");
if(listButtonDeletePer.length > 0){
  listButtonDeletePer.forEach((item) => {
    item.addEventListener("click", ()=>{
      let check = confirm("Bạn chắc chắn xóa ?");
      if(check){
        const link = item.getAttribute("link-id-button-trash");
        fetch(link, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        })
        .then(res => res.json())
        .then(data => {
          if(data.code == 200)
            window.location.reload();
        })
      }
    });
  });
}
// End Xoa vinh vien