import React, { useRef } from 'react';

const UploadButton = ({ userId }) => {
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const files = event.target.files;
        // Perform any validation or preprocessing on the files here
        console.log(files);
        // You can send the files to the server using an API call here
        const formData = new FormData();
        formData.append('file', files[0]);

        fetch(`http://localhost:8000/upload/${userId}`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                // Handle the response from the server
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors that occurred during the upload
            });
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current.click()}>Upload File</button>
        </div>
    );
};

export default UploadButton;
