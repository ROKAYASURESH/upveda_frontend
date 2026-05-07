import Swal from "sweetalert2";

const showDeleteConfirmation = () => {
  const result = Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this item?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  return result;
};
const showConfirmation = (text = "", buttonText = "") => {
  const result = Swal.fire({
    title: "Are you sure?",
    text: text || "Do you want to proceed?",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: buttonText || "Yes",
    cancelButtonText: "Cancel",
  });

  return result;
};
export default showDeleteConfirmation;
export { showConfirmation };
