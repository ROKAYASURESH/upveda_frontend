import { useSelector } from "react-redux"
import permission from "../../services/permission";
import { useNavigate } from "react-router-dom";
export default function EditBtn({ menu, url }) {
    const { data } = useSelector((state) => state.data);
    const navigate = useNavigate();
    if (permission(data, menu, 'Edit')) {
        return (
            <button className="btn btn-sm btn-primary me-2" onClick={() => navigate(url)}>
                <i className="fa fa-pencil-square"></i>
            </button>
        )

    } else {
        return (<></>)
    }
}