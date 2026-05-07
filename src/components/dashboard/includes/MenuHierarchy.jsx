import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MenuHierarchy = ({ menus, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const activeNavItem = document.querySelector(".nav-item.active");
    if (activeNavItem) {
      const closestCollapseDiv = activeNavItem.closest("div.collapse");
      if (closestCollapseDiv) {
        closestCollapseDiv.classList.add("show");
      }
    }
  }, [location, menus]);
  const renderMenuItems = (items) =>
    items.map((item) => {
      const isActive = location.pathname === item.url;
      return (
        <li className={`nav-item ${isActive ? "active" : ""}`} key={item.id}>
          {item.children && item.children.length > 0 ? (
            <>
              <span
                className="nav-link collapsed d-flex justify-content-between align-items-center"
                data-bs-toggle="collapse"
                data-bs-target={`#submenu-${item.id}`}
              >
                <span>
                  <span className="sidebar-icon">
                    <i className={item.icon} aria-hidden="true"></i>
                  </span>
                  <span className="sidebar-text">{item.title}</span>
                </span>
                <span className="link-arrow">
                  <svg
                    className="icon icon-sm"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </span>

              <div
                className="multi-level collapse"
                role="list"
                id={`submenu-${item.id}`}
                aria-expanded="false"
              >
                <ul className="flex-column nav">
                  {renderMenuItems(item.children)}
                </ul>
              </div>
            </>
          ) : (
            <a className="nav-link" onClick={() => navigate(item.url)}>
              <span className="sidebar-icon">
                <i className={item.icon} aria-hidden="true"></i>
              </span>
              <span className="sidebar-text">{item.title}</span>
            </a>
          )}
        </li>
      )
    });

  return (
    <nav
      id="sidebarMenu"
      className="sidebar d-lg-block bg-gray-800 text-white collapse"
      data-simplebar
    >
      <div className="sidebar-inner px-4 pt-3">
        <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
          <div className="d-flex align-items-center">
            <div className="avatar-lg me-4"></div>
            <div className="d-block">
              <h2 className="h5 mb-3">Hi, {user.username}</h2>
              <a
                href="/logout"
                className="btn btn-secondary btn-sm d-inline-flex align-items-center"
              >
                <svg
                  className="icon icon-xxs me-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Sign Out
              </a>
            </div>
          </div>
          <div className="collapse-close d-md-none">
            <a
              href="#sidebarMenu"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="true"
              aria-label="Toggle navigation"
            >
              <svg
                className="icon icon-xs"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <span className="sidebar-icon">
            <span className="mt-1 ms-1 sidebar-text">CMS</span>
          </span>
        </div>

        <ul className="nav flex-column pt-3 pt-md-0">
          <li className="nav-item">
            <a onClick={() => navigate('/')} className="nav-link">
              <span className="sidebar-icon">
                <i className="fa fa-pie-chart" aria-hidden="true"></i>
              </span>
              <span className="sidebar-text">Dashboard</span>
            </a>
          </li>
          {renderMenuItems(menus)}
        </ul>
      </div>
    </nav>
  );
};

export default MenuHierarchy;
