const { Branch } = require("../models/productModel");

const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    if (!branches || branches.length === 0) {
      return res.status(204).send({
        message: "No branches found",
        type: "warning",
      }); // return 204 when no product(s) were found
    }
    return res.status(200).send({ data: branches });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ title: "Invalid request", message: "Please, check your parameters" });
  }
};

const createBranch = async (req, res) => {
  const { name } = req.params;
  try {
    const newBranch = new Branch({ name });
    const branch = await newBranch.save();
    return res.status(200).send({
      data: branch,
      message: `Added ${branch.name} to the database`,
      type: "success",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ title: "Duplicated Item", type: "warning", message: "Branch already exists" });
    }

    return res.status(500).send({ title: error.code, message: "An error occurred" });
  }
};

const deleteBranch = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send({ message: "`id` not found or invalid, please check your parameters" });
    }
    const branch = await Branch.findByIdAndDelete(id);
    if (!branch) {
      return res.status(404).send({ message: "Branch not found" });
    }
    return res.status(200).send({ message: "Branch deleted successfully", data: branch });
  } catch (error) {
    return res.status(400).send({ message: "Invalid request, please check your parameters" });
  }
};

module.exports = {
  getBranches,
  createBranch,
  deleteBranch,
};
