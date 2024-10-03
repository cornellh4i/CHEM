// routes/users.ts
import { Router } from "express";
import controller from "../controllers/users";

const userRouter = Router();

// GET all users
userRouter.get("/", async (req, res) => {
  // TODO: Implement GET all users route
  // This should handle query parameters for filtering, sorting, and pagination
  res.status(501).json({ error: "GET all users route not implemented" });
});

// GET a single user by ID
userRouter.get("/:id", async (req, res) => {
  // TODO: Implement GET single user route
  res.status(501).json({ error: "GET single user route not implemented" });
});

// POST a new user
userRouter.post("/", async (req, res) => {
  // TODO: Implement POST new user route
  res.status(501).json({ error: "POST new user route not implemented" });
});

userRouter.put("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']

  // Extract information from header
  const userid = req.params.userid;
  const userData = req.body;

  try {
    // Call the updateUser controller function to update the user with the given id
    const updatedUser = await controller.updateUser(userid, userData);

    if (!updatedUser) {
      // If no user is found, return 404 Not Found
      return res.status(404).json({ error: "User not found" });
    }
    // Send the updated user as the response
    res.status(200).json(updatedUser);

    // Call notify function
    notify(`/users/${userid}`);
  } catch (error) {
    if (error instanceof Error) {
      // Return error message if error
      res.status(404).json({ error: error.message });
    }
  }
});

userRouter.patch("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']

  // Exract information from header
  const userid = req.params.userid;
  const partialUserData = req.body;

  try {
    // Call updateUser with partial user data
    const updatedUser = await controller.updateUser(userid, partialUserData);

    // Return updated user
    res.status(200).json(updatedUser);

    // Call notify
    notify(`/users/${userid}`);
  } catch (error) {
    if (error instanceof Error) {
      // Catch and return errors if any
      res.status(404).json({ error: error.message });
    }
  }
});

userRouter.delete("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']
  
  // Extract userid from req.query
  const userid = req.params.userid;

  try {
    // Call controller.deleteUser to delete the user with userid
    const deletedUser = await controller.deleteUser(userid);

    // Send deleted user as the response
    res.status(200).json(deletedUser);

    // Call notify function with "/users"
    notify(`/users/${userid}`);
  } catch (error) {
    if (error instanceof Error) {
      // Handle errors and send error response
      res.status(404).json({ error: error.message });
    }
  }
});

export default userRouter;
