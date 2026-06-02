function openPopup() {
    document.getElementById("appointmentModal").style.display = "block";
}

function closePopup() {
    document.getElementById("appointmentModal").style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById("appointmentModal");

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function sendAppointment(){

let name =
document.getElementById("patientName").value;

let mobile =
document.getElementById("mobile").value;

let date =
document.getElementById("date").value;

let time =
document.getElementById("time").value;

let reason =
document.getElementById("reason").value;

let message =
`New Appointment Request

Patient Name: ${name}
Mobile: ${mobile}
Date: ${date}
Time: ${time}
Reason: ${reason}

Please confirm appointment.`;

let whatsappNumber =
"919004130508";

let url =
`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

window.open(url, "_blank");
}