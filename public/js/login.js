const form = document.getElementById("loginForm")
form.addEventListener("submit", (e) =>{
    e.preventDefault()
    const login = {
        user: user.value,
        pass: pass.value
    }
    fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(login),
        headers: { 
            "Content-type" : "application/JSON"
        }
    }).then(res => res.json())
    .then(data => {
  
        if(data.status == "error") {
            iziToast.error({
                message:data.error,
                position:"topCenter"
            })
            error.innerText = data.error;
        }
        else{
           iziToast.success({
                message:data.success,
                position:"topCenter"
            })
            window.location.reload()

        }
        })
    })

    // module.exports = login;



    function show_pass() {
        var pass = document.getElementById("pass");
        if (pass.type === "password") {
          pass.type = "text";
        } else {
          pass.type = "password";
        }
      }