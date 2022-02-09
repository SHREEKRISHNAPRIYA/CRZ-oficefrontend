import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import axiosInstance from "./Utils/axios";
import "./index.css";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState();
  const [error, setError] = useState();
  const onInputChange=(e)=>{
    setError(null);
    setProgress(null);
   };
  const submitHandler = (e) => {
    
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", selectedFiles[0]);
    axiosInstance
      .post("/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          setProgress(Math.round(100 * (data.loaded / data.total)));
        },
      })
      .catch((error) => {
        const code = error?.response?.data?.code;
        switch (code) {
          case "FILE_MISSING":
            setError("Please select a file before uploading");
            break;
          case "LIMIT_FILE_SIZE":
            setError("File size is too large. Please upload files below 3MB!");
            break;
          case "INVALID_TYPE":
            setError(
              "This file type is not supported. Only .pdf and .ms-excel files are allowed"
            );
            break;
          default:
            setError("Sorry, something went wrong");
            break;
        }
      });
  };
  return (
    <Container>
      <Row>
        <Col lg={{ span: 3 }}>
          <Form onSubmit={submitHandler}onChange={onInputChange}><h3>UPLOAD CLERENCE</h3>
          
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select a File</Form.Label>
              
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button variant="primary" type="submit">
                Upload
              </Button>
            </Form.Group>

           {!error && progress && (
              <ProgressBar now={progress} label={`${progress}%`} />
            )}{error && <Alert variant="danger">{error}</Alert>}

          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;