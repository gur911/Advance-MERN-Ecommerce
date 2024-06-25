const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)) // Wrap the execution of `fn` in `Promise.resolve` to handle both synchronous and asynchronous errors.
    .catch((error) => {
      console.error("Async Error Handler caught an error:", error); // Log the error for debugging purposes.
      res.status(500).json({ message: error?.message || "Internal Server Error" }); // Send a 500 Internal Server Error response with the error message.
    });
};

export default asyncHandler;
