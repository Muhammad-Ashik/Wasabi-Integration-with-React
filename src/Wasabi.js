import React from "react";
import AWS from "aws-sdk";

function Wasabi() {
  function getFiles() {
    const s3 = new AWS.S3({
      correctClockSkew: true,
      endpoint: "s3.us-west-1.wasabisys.com",
      accessKeyId: "260TRVGWE9KEDZ5H4JJT",
      secretAccessKey: "NELa9XnEhWhFKJXBi3FSXji1BBaJP5kP2ejlGaGk",
      region: "us-west-1",
      logger: console,
    });
    var params = {
      Bucket: "react-api-test",
    };

    s3.listObjectsV2(params, function (err, data) {
      if (!err) {
        var files = [];
        data.Contents.forEach(function (element) {
          console.log(element, "element");
          files.push({
            filename: element.Key,
            lastModified: element.LastModified,
            size: element.Size,
          });
        });
        console.log(files);
      } else {
        console.log(err);
      }
    });
  }

  function downloadFile() {
    const s3 = new AWS.S3({
      correctClockSkew: true,
      endpoint: "s3.us-west-1.wasabisys.com",
      accessKeyId: "260TRVGWE9KEDZ5H4JJT",
      secretAccessKey: "NELa9XnEhWhFKJXBi3FSXji1BBaJP5kP2ejlGaGk",
      region: "us-west-1",
      logger: console,
    });
    var bname = document.getElementById("bname").value;
    var fname = document.getElementById("fname").value;
    var params = {
      Bucket: bname,
      Key: fname,
    };

    s3.getObject(params, function (err, data) {
      if (!err) {
        console.log(data);
      } else {
        console.log(err);
      }
    });
  }

  function createBucket() {
    const s3 = new AWS.S3({
      correctClockSkew: true,
      endpoint: "s3.us-west-1.wasabisys.com",
      accessKeyId: "260TRVGWE9KEDZ5H4JJT",
      secretAccessKey: "NELa9XnEhWhFKJXBi3FSXji1BBaJP5kP2ejlGaGk",
      region: "us-west-1",
      logger: console,
    });
    var bucket = document.getElementById("createBucket").value;
    let r = window.confirm(
      `Wasabi is going to create ${bucket} bucket for you`
    );
    if (r === true) {
      var params = {
        Bucket: bucket,
      };
      s3.createBucket(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          alert(err, err.stack);
        } else {
          console.log(data);
          alert("Created");
        }
      });
    } else {
      alert("You cancelled");
    }
  }

  function handleFile() {
    var files = document.getElementById("wasabiupload").files;
    if (!files.length) {
      return alert("Please choose a file to upload first.");
    }
    var f = files[0];
    var fileName = f.name;

    const s3 = new AWS.S3({
      correctClockSkew: true,
      endpoint: "s3.us-west-1.wasabisys.com",
      accessKeyId: "260TRVGWE9KEDZ5H4JJT",
      secretAccessKey: "NELa9XnEhWhFKJXBi3FSXji1BBaJP5kP2ejlGaGk",
      region: "us-west-1",
      logger: console,
    });
    alert("File loaded");
    console.log("Loaded");
    const uploadRequest = new AWS.S3.ManagedUpload({
      params: { Bucket: "react-api-test", Key: fileName, Body: f },
      service: s3,
    });

    uploadRequest.on("httpUploadProgress", function (event) {
      const progressPercentage = Math.floor((event.loaded * 100) / event.total);
      console.log("Upload progress " + progressPercentage);
    });

    console.log("Configed and sending");

    uploadRequest.send(function (err) {
      if (err) {
        alert("File not uploaded");
        console.log("UPLOAD ERROR: " + JSON.stringify(err, null, 2));
      } else {
        alert("File uploaded successful");
        console.log("Good upload");
      }
    });
  }

  return (
    <div>
      <h1>Wasabi Upload Test</h1>
      <input type="file" id="wasabiupload" onChange={handleFile} />
      <button onClick={createBucket}>Create your bucket</button>
      <input
        style={{ marginRight: "100px" }}
        placeholder="bucket name"
        type="text"
        id="createBucket"
      />
      <button onClick={downloadFile}>Download a file</button>
      <input placeholder="bucket name" type="text" id="bname" />
      <input
        style={{ marginRight: "100px" }}
        placeholder="file name"
        type="text"
        id="fname"
      />
      <button onClick={getFiles}>Get all files details</button>
    </div>
  );
}

export default Wasabi;
