import { useSelector } from "react-redux"
import permission from "../../services/permission";
import { useNavigate } from "react-router-dom";
export default function AddBtn({ menu, btnName, url }) {
    const { data } = useSelector((state) => state.data);
    const navigate = useNavigate();
    if (permission(data, menu, 'Create')) {
        return (
            <button className="btn btn-sm ms-1 btn-gray-800 d-inline-flex align-items-center" type="button" onClick={() => navigate(url)}>
                <svg className="icon icon-xs me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {btnName || 'Create'}
            </button>
        )

    } else {
        return (<></>)
    }
}