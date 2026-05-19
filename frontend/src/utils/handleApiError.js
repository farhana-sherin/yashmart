export const handleApiError = (error) => {
  if (error.response) {
    return (
      error.response.data.message ||
      "Something went wrong"
    );
  }

  if (error.request) {
    return "Network Error";
  }

  return "Unexpected Error";
};