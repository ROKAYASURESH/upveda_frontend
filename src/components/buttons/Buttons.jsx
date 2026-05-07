import { useSelector } from 'react-redux';
import permission from '../../services/permission';

function Button({ menu, type = null, onClick, url = null, children = null, title = '', ...props }) {
  const { data } = useSelector((state) => state.data);
  if (permission(data, menu, type)) {
    return (
      <button {...props} data-bs-toggle="tooltip" data-bs-placement="bottom" title={title} onClick={onClick}>
        {children}
      </button>
    );
  } else {
    return <></>;
  }
}

export { Button };