import { useSelector } from "react-redux"
import permission from "../../services/permission";
export default function AddModalBtn({ menu, btnName, type = 'Create' }) {
    const { data } = useSelector((state) => state.data);
    if (permission(data, menu, type)) {
        return (
            <button className="btn btn-sm btn-gray-800 mx-2 d-inline-flex align-items-center" data-bs-toggle="modal" data-bs-target="#staticBackdrop" type="button">
                {/* <i className="fa fa-file-excel" aria-hidden="true"></i> &nbsp; */}
                {btnName || 'Create'}
            </button>
        )

    } else {
        return (<></>)
    }
}