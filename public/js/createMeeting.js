const createMeetingForm = document.getElementById("createMeeting")

createMeetingForm.addEventListener("submit", function(e) {
    e.preventDefault()
    const formData = {
        roomName: roomName.value
    }
    fetch(`/createMeeting`, {
        method:"POST",
        body: JSON.stringify(formData),
        headers: { 
            "Content-type" : "application/JSON"
        }
    }).then(res =>res.json())
    .then(data =>{
        if(data.error){
            alert(data.error)
        }else{
            const hostURL = data.host 
            const attendeeURL = data.attendee 
            const currentDomain = window.location.origin 

            // URL TEMPLATE FORMAT 
            // const url = `${currentDomain}/${hostURL} `
           alert(data.success)
        }
    })
})