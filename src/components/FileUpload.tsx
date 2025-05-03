import axios from "axios";
import React, { useState } from "react";

const FileUpload: React.FC = () => {


    const [selectedFile, setSelectedFile] = useState(null);
    const onFileChange = (event) => {
        setSelectedFile(event.targe.files[0]);
    }

    const onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            'myFile',
            selectedFile,
            SelectedFile.name
        );
        console.log(selectedFile);
        // axios{ }
    };

    const fileData = () => {
        if (selectedFile) {
            return (
                <div>
                    <h2> File details:</h2>
                    <p>{selectedFile.name}</p>

                </div>
            );
        } else {
            return (
                <div>hey, do something</div>
            )
        }
    }

    return (
        <>
            This is the file image upload
            <div>{fileData()}</div>
        </>
    )
};


export default FileUpload;
