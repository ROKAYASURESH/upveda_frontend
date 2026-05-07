import { useSelector } from "react-redux"
import permission from "../../services/permission";
export default function EditModalBtn({ menu, onClick }) {
    const { data } = useSelector((state) => state.data);
    if (permission(data, menu, 'Edit')) {
        return (
            <button className="btn btn-sm btn-primary me-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={onClick}>
                <i className="fa fa-pencil-square"></i>
            </button>
        )

    } else {
        return (<></>)
    }
}