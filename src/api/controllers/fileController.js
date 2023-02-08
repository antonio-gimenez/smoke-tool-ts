const { File } = require("../models/fileModel");

const uploadFile = async (req, res) => {
  if (!req.file) {
    // If no file is provided, return an error
    return res.status(400).send("No file provided");
  }
  // Create a new instance of the File model
  const newFile = new File({
    // Set the file name
    file: req.file.buffer,
    // Set the file type
    contentType: req.file.mimetype,
  });

  // Save the file to the database
  try {
    await newFile.save();
    res.send(`File uploaded successfully!`);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getFile = async (req, res) => {
  const { id } = req.query;
  try {
    // Find the file by its id
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).send("File not found");
    }
    // Set the content type header
    res.contentType(file.contentType);

    // Send the file buffer in the response
    res.send(file.file);
  } catch (err) {
    res.status(500).send(err);
  }
};

const removeFile = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).send({ message: "`id` not found or invalid, please check your parameters" });
    }
    const file = await File.findByIdAndDelete(id);
    if (!file) {
      return res.status(404).send({ message: "File not found" });
    }
    return res.status(200).send({ message: "File deleted successfully", data: file });
  } catch (error) {
    return res.status(400).send({ message: "Invalid request, please check your parameters" });
  }
};

module.exports = {
  uploadFile,
  getFile,
  removeFile,
};
