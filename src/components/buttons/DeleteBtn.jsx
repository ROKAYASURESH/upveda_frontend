import { useSelector } from "react-redux"
import permission from "../../services/permission";
export default function DeleteBtn({ menu, onClick }) {
    const { data } = useSelector((state) => state.data);
    if (permission(data, menu, 'Delete')) {
        return (
            <button className="btn btn-sm btn-danger" onClick={onClick}>
                <i className="fa fa-times"></i>
            </button>
        )

    } else {
        return (<></>)
    }
}