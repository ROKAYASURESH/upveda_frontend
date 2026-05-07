function promptFileUpload() {
    Swal.fire({
        title: "Select a file to upload",
        input: "file",
        inputAttributes: {
            accept: ".xlsx, .xls"
        },
        showCancelButton: true,
        confirmButtonText: "Upload"
    }).then((result) => {
        if (result.value) {
            // Set the selected file to the hidden form's file input
            const fileInput = document.getElementById("fileInput");
            fileInput.files = result.value.files;
            
        }
    });
}