window.onload = function () {

document.getElementById("profileName").value =
localStorage.getItem("name") || "";

document.getElementById("profileEmail").value =
localStorage.getItem("email") || "";

document.getElementById("profileBudget").value =
localStorage.getItem("budget") || "";

}

function saveProfile(){

localStorage.setItem(

"name",

document.getElementById("profileName").value

);

localStorage.setItem(

"budget",

document.getElementById("profileBudget").value

);

alert("Profile Updated Successfully");

}