import { useEffect } from 'react';
import MenuHierarchy from "./MenuHierarchy";
import { useSelector, useDispatch } from "react-redux";
import { fetchMenus as fetchMenusAction } from '../../../store/slices/menuSlice.js';

export default function Sidebar() {
  const { menus } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const user = {
    username: 'User'
  }

  // const fetchMenus = useCallback(() => {
  //   setIsLoading(true);
  //   getSidebar().then(res => {
  //     setMenus(res.data)
  //   }).finally(() => {
  //     setIsLoading(false);
  //   })
  // }, []);

  useEffect(() => {
    dispatch(fetchMenusAction());
  }, []);

  return (
    <>
      <MenuHierarchy menus={menus} user={user} />
    </>
  )
}